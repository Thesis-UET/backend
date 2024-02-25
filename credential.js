export const credential = {
    "@context": [
        "https://www.w3.org/2018/credentials/v1",
        "credential:schema:event:hackathon"
    ],
    "type": [
        "VerifiableCredential",
        "AccessPassCredential"
    ],
    "issuer": "did:avax:zDnaeWzcHdM7gTqVhGY2n8TSf9UKDWoh9rT2YdoWGpsycr9DJ",
    "credentialSubject": {
        "id": "did:avax:zDnaeSMnptAKpH4AD41vTkwzjznW7yNetdRh9FJn8bJsbsdbw",
        "type": "AccessPass",
        "eventName": "Hackathon Avax 2023",
        "passId": "abc-123-xyz",
        "name": "Patrick Nguyen",
        "startDate": "December 1, 2023",
        "endDate": "December 25, 2023",
        "location": "Ha Noi, Viet Nam",
    }
};