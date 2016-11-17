import React, {Component, PropTypes} from 'react';

import PDFPage from './PDFPage.js';
import '../../../../node_modules/pdfjs-dist/web/pdf_viewer.css';

import {isClient} from 'app/utils';

let PDFJS;
if (isClient) {
  PDFJS = require('../../../../node_modules/pdfjs-dist/web/pdf_viewer.js').PDFJS;
  PDFJS.workerSrc = '/pdf.worker.bundle.js';
}
import {countPDFChars} from 'app/PDF/utils.js';

export class PDF extends Component {

  constructor(props) {
    super(props);
    this.state = {pdf: {numPages: 0}};
    this.pagesLoaded = {};
    if (isClient) {
      PDFJS.getDocument(props.file).then(pdf => {
        countPDFChars(props.file)
        .then((count) => {
          count[0] = 0;
          this.count = count;
          this.setState({pdf});
        });
      });
    }
  }

  componentDidMount() {
    this.refs.pdfContainer.addEventListener('textlayerrendered', (e) => {
      this.pageLoaded(e.detail.pageNumber);
    });
  }

  pageUnloaded(numPage) {
    delete this.pagesLoaded[numPage];
    const start = this.count[Math.min.apply(null, Object.keys(this.pagesLoaded).map(n => parseInt(n, 10))) - 1];
    const end = this.count[Math.max.apply(null, Object.keys(this.pagesLoaded).map(n => parseInt(n, 10)))];
    //console.log('unload');
    this.props.onLoad({start, end});
  }

  pageLoading(numPage) {
    this.pagesLoaded[numPage] = false;
  }

  pageLoaded(numPage) {
    this.pagesLoaded[numPage] = true;
    let allPagesLoaded = (Object.keys(this.pagesLoaded).map(p => this.pagesLoaded[p]).filter(p => !p).length === 0);
    if (allPagesLoaded) {
      //console.log(this.count[Math.min.apply(null, Object.keys(this.pagesLoaded).map(n => parseInt(n, 10))) - 1]);
      const start = this.count[Math.min.apply(null, Object.keys(this.pagesLoaded).map(n => parseInt(n, 10))) - 1];
      const end = this.count[Math.max.apply(null, Object.keys(this.pagesLoaded).map(n => parseInt(n, 10)))];
      //console.log('load');
      this.props.onLoad({start, end});
    }
  }

  render() {
    return (
      <div ref='pdfContainer' style={this.props.style}>
        {(() => {
          let pages = [];
          for (let page = 1; page <= this.state.pdf.numPages; page += 1) {
            pages.push(<PDFPage onUnload={this.pageUnloaded.bind(this)} onLoading={this.pageLoading.bind(this)} key={page} page={page} pdf={this.state.pdf} />);
          }
          return pages;
        })()}
      </div>
    );
  }
}

PDF.propTypes = {
  file: PropTypes.string,
  style: PropTypes.object,
  onLoad: PropTypes.func
};

export default PDF;
