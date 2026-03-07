import React from 'react';
import ContactUs from '../../pages/ContactUs';

const Contact = () => {
  return <ContactUs onSubmitMessage={(message) => console.log('Contact message:', message)} />;
};

export default Contact;
