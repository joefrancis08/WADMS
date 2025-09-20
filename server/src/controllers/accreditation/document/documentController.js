import fetchDocuments from "./GET/fetchDocuments.js";
import addDocument from "./POST/addDocument.js";

export const addDocumentController = (req, res) => addDocument(req, res);

export const fetchDocumentController = (req, res) => fetchDocuments(req, res);