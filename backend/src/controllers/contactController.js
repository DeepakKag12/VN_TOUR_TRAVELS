import { store } from '../models/store.js';
import { isDbConnected } from '../config/db.js';
import { Contact } from '../models/Contact.js';
import { getNextSeq } from '../services/sequence.js';

export const submitContact = async (req, res) => {
  const { name, email, message } = req.body;
  if(!name || !email || !message) return res.status(400).json({ error:'name,email,message required' });
  if(isDbConnected()){
    const nextId = await getNextSeq('contactId');
    const contact = await Contact.create({ id: nextId, name, email, message });
    return res.json({ success:true, contact });
  }
  const contact = { id: store.contacts.length + 1, name, email, message, createdAt: new Date().toISOString() };
  store.contacts.push(contact);
  res.json({ success: true, contact });
};

export const listContacts = async (_req, res) => {
  if(isDbConnected()){
    const contacts = await Contact.find().sort({ id:-1 });
    return res.json(contacts);
  }
  res.json(store.contacts);
};
