import fetch from 'node-fetch';

const headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'api-key': process.env.SIB_API_KEY || ''
};

export const invitationEmailSIB = async (uid: string, senderFirstName: string, receiverEmail: string) => {

    const options = {
        method: 'POST',
        headers,
        body: JSON.stringify({
            sender: { name: 'H2T', email: 'contact@h2t.club' },
            to: [{ email: receiverEmail }],
            replyTo: { email: 'contact@h2t.club', name: 'H2T' },
            params: { senderName: senderFirstName, uid, mail: receiverEmail },
            templateId: 2
        })
    };

    fetch('https://api.sendinblue.com/v3/smtp/email', options)
        .then(res => res.json())
        .then(json => console.log(json))
        .catch(err => console.error('error:' + err));
}

export const addContactSIB = async (email: string, firstName: string, lastname?: string) => {

    const options = {
        method: 'POST',
        headers,
        body: JSON.stringify({
            attributes: { PRENOM: firstName, NOM: lastname },
            listIds: [2],
            updateEnabled: true,
            email
        })
    };

    fetch('https://api.sendinblue.com/v3/contacts', options)
        .then(res => res.json())
        .then(json => console.log(json))
        .catch(err => console.error('error:' + err));
}
