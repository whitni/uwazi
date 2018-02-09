import referencesAPI from 'app/Viewer/referencesAPI';
import {evidencesAPI} from 'app/evidences';
import relationTypesAPI from 'app/RelationTypes/RelationTypesAPI';
import referencesUtils from 'app/Viewer/utils/referencesUtils';
import {getDocument} from 'app/Viewer/actions/documentActions';

import {actions} from 'app/BasicReducer';
import {setReferences} from './referencesActions';
import {docEvidencesActions} from 'app/evidences';

export function requestViewerState(documentId, lang) {
  return Promise.all([
    getDocument(documentId),
    referencesAPI.get(documentId),
    relationTypesAPI.get(),
    evidencesAPI.get(documentId)
  ])
  .then(([doc, references, relationTypes, docEvidences]) => {
    return {
      documentViewer: {
        doc,
        references: referencesUtils.filterRelevant(references, lang),
        relationTypes
      },
      relationTypes,
      evidences: {
        docEvidences
      }
    };
  });
}

export function setViewerState(state) {
  return function (dispatch) {
    const {documentViewer} = state;
    dispatch(actions.set('relationTypes', state.relationTypes));
    dispatch(actions.set('viewer/doc', documentViewer.doc));
    dispatch(actions.set('viewer/relationTypes', documentViewer.relationTypes));
    dispatch(setReferences(documentViewer.references));
    dispatch(docEvidencesActions.set(state.evidences.docEvidences));
  };
}
