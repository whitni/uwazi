import { Field, Form, actions as formActions } from 'react-redux-form';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import React, { Component } from 'react';

import { I18NLink, t } from 'app/I18N';
import { Icon } from 'UI';
import { searchDocuments, getSuggestions, hideSuggestions, setOverSuggestions } from 'app/Library/actions/libraryActions';
import { wrapDispatch } from 'app/Multireducer';
import SafeHTML from 'app/utils/SafeHTML';
import debounce from 'app/utils/debounce';

export class SearchBar extends Component {
  componentWillMount() {
    this.getSuggestions = debounce(this.getSuggestions, 400);
  }

  componentWillUnmount() {
    this.props.setOverSuggestions(false);
  }

  onChange(e) {
    this.props.change(`${this.props.storeKey}.search.searchTerm`, e.target.value);
    this.getSuggestions(e);
  }

  getSuggestions(e) {
    this.props.getSuggestions(e.target.value);
  }

  closeSuggestions() {
    this.props.setOverSuggestions(false);
    this.props.hideSuggestions();
  }

  mouseEnter() {
    this.props.setOverSuggestions(true);
  }

  mouseOut() {
    this.props.setOverSuggestions(false);
  }

  resetSearch() {
    this.props.change(`${this.props.storeKey}.search.searchTerm`, '');
    const search = Object.assign({}, this.props.search);
    search.searchTerm = '';
    this.props.searchDocuments({ search }, this.props.storeKey);
  }

  submitSearch() {
    const search = Object.assign({}, this.props.search);
    this.props.searchDocuments({ search }, this.props.storeKey);
  }

  search(search) {
    this.props.searchDocuments({ search }, this.props.storeKey);
  }

  render() {
    const { search, showSuggestions, suggestions, overSuggestions } = this.props;
    const model = `${this.props.storeKey}.search`;
    return (
      <div className={`search-box${this.props.open ? ' is-active' : ''}`}>
        <Form model={model} onSubmit={this.search.bind(this)} autoComplete="off">
          <div className={`input-group${search.searchTerm ? ' is-active' : ''}`}>
            <Field model=".searchTerm" updateOn="submit">
              <Icon
                icon="search"
                onClick={this.submitSearch.bind(this)}
              />
              <input
                type="text"
                placeholder={t('System', 'Search', null, false)}
                className="form-control"
                onChange={this.onChange.bind(this)}
                onBlur={this.props.hideSuggestions}
                autoComplete="off"
              />
              <Icon icon="times" onClick={this.resetSearch.bind(this)} />
            </Field>
          </div>
          <div
            onMouseOver={this.mouseEnter.bind(this)}
            onMouseLeave={this.mouseOut.bind(this)}
            className={`search-suggestions${showSuggestions && search.searchTerm || overSuggestions ? ' is-active' : ''}`}
          >
            {suggestions.toJS().map((suggestion, index) => {
              const documentViewUrl = `/${suggestion.type}/${suggestion.sharedId}`;
              return (
                <p className="search-suggestions-item" key={index}>
                  <I18NLink to={documentViewUrl}>
                    <span><SafeHTML>{suggestion.title}</SafeHTML></span>
                    <Icon icon="file" />
                  </I18NLink>
                </p>);
            })}
            <button
              className="search-suggestions-all"
              type="submit"
              onClick={this.closeSuggestions.bind(this)}
            >
              View all results for <b>{search.searchTerm}</b>
            </button>
          </div>
        </Form>
      </div>
    );
  }
}

SearchBar.propTypes = {
  searchDocuments: PropTypes.func.isRequired,
  open: PropTypes.bool,
  change: PropTypes.func.isRequired,
  getSuggestions: PropTypes.func.isRequired,
  hideSuggestions: PropTypes.func.isRequired,
  setOverSuggestions: PropTypes.func.isRequired,
  suggestions: PropTypes.object,
  showSuggestions: PropTypes.bool,
  search: PropTypes.object,
  overSuggestions: PropTypes.bool,
  storeKey: PropTypes.string
};

export function mapStateToProps(state, props) {
  return {
    search: state[props.storeKey].search,
    suggestions: state[props.storeKey].ui.get('suggestions'),
    showSuggestions: state[props.storeKey].ui.get('showSuggestions'),
    overSuggestions: state[props.storeKey].ui.get('overSuggestions'),
    open: state[props.storeKey].ui.get('filtersPanel') && !state.library.ui.get('selectedDocument')
  };
}

function mapDispatchToProps(dispatch, props) {
  return bindActionCreators({
    searchDocuments,
    getSuggestions,
    hideSuggestions,
    setOverSuggestions,
    change: formActions.change
  }, wrapDispatch(dispatch, props.storeKey));
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchBar);
