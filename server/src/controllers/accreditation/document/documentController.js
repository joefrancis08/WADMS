import deleteDoc from "./DELETE/deleteDoc.js";
import fetchDocuments from "./GET/fetchDocuments.js";
import addDocument from "./POST/addDocument.js";
import { updateDocumentName } from "./UPDATE/updateDoc.js";

export const addDocumentController = (req, res) => addDocument(req, res);

export const fetchDocumentsController = (req, res) => fetchDocuments(req, res);

export const updateDocController = (req, res) => updateDocumentName(req, res);

export const deleteDocController = (req, res) => deleteDoc(req, res);
