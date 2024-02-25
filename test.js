import {VeresOneDriver} from 'did-veres-one';
import * as EcdsaMultikey from '@digitalbazaar/ecdsa-multikey';
import {v4 as uuid} from 'uuid';
import {Ed25519Signature2018} from '@digitalbazaar/ed25519-signature-2018';
import * as vc from '@digitalbazaar/vc';
import * as ecdsaSd2023Cryptosuite from
        '@digitalbazaar/ecdsa-sd-2023-cryptosuite';
import {DataIntegrityProof} from '@digitalbazaar/data-integrity';
import {
    Ed25519VerificationKey2018
} from '@digitalbazaar/ed25519-verification-key-2018';
import {mock as mockData} from './mocks/mock.data.js';

const {createSignCryptosuite} = ecdsaSd2023Cryptosuite;
import jsigs from 'jsonld-signatures';

import jsonld from 'jsonld';
import {remoteDocuments} from "./dataloader.js";

const {extendContextLoader} = jsigs;
const {defaultDocumentLoader} = vc;

const testContextLoader = extendContextLoader(async url => {
    const remoteDocument = remoteDocuments.get(url);
    console.log('url', url);

    if (remoteDocument) {
        return {
            contextUrl: null,
            document: jsonld.clone(remoteDocument),
            documentUrl: url
        };
    }
    return defaultDocumentLoader(url);
});


export class MultiLoader {
    constructor({documentLoader} = {}) {
        this.loaders = [];
        if (documentLoader) {
            this.loaders = this.loaders.concat(documentLoader);
        }
    }

    addLoader(loader) {
        this.loaders.push(loader);
    }

    async documentLoader(url) {
        let result;
        for (const loader of this.loaders) {
            try {
                result = await loader(url);
            } catch (e) {
                // this loader failed move on to the next
                continue;
            }
            if (result) {
                return result;
            }
        }
        // failure, throw
        throw new Error(`Document not found: ${url}`);
    }

} // end MultiLoader

const testLoader = new MultiLoader({
    documentLoader: [
        // CREDENTIALS_CONTEXT_URL
        testContextLoader
    ]
});

const documentLoader = testLoader.documentLoader.bind(testLoader);

async function _loadDid() {
    const driver = new VeresOneDriver({mode: 'test'});
    const didDocument = await driver.generate({
        seed: new Uint8Array(32)
    });
    const documentLoader = url => {
        let document;
        if (url.includes('#')) {
            document = didDocument.keyPairs.get(url);
            console.log('document if 1', document);
        } else if (url === didDocument.didDocument.id) {
            document = didDocument.didDocument;
            console.log('document if 1', document);
        }
        if (document) {
            return {contextUrl: null, document, documentUrl: url};
        }
        throw new Error(`"${url}" not authorized to be resolved.`);
    };
    return {
        didDocument, documentLoader
    };
}


async function _generateCredential() {
    const mockCredential = jsonld.clone({
        "@context": [
            "https://www.w3.org/2018/credentials/v1",
            "credential:schema:event:hackathon"
        ],
        "type": [
            "VerifiableCredential",
            "AccessPassCredential"
        ],
        "issuer": "did:avax:issuer1",
        "issuanceDate": '2010-01-01T19:23:24Z',

        "credentialSubject": {
            "id": "did:avax:holder1",
            "type": "AccessPass",
            "eventName": "Hackathon Avax 2023",
            "passId": "abc-123-xyz",
            "name": "Patrick Nguyen",
            "startDate": "November 2, 2023",
            "endDate": "November 2, 2023",
            "location": "Ha Noi, Viet Nam"
        }
    });
    const {didDocument, documentLoader} = await _loadDid();
    mockCredential.issuer = didDocument.didDocument.id;
    mockCredential.id = `http://example.edu/credentials/${uuid()}`;
    testLoader.addLoader(documentLoader);
    console.log('mockCredential', mockCredential)

    const assertionKey = didDocument.methodFor({purpose: 'assertionMethod'});

    const suite = new Ed25519Signature2018({key: assertionKey});
    const credential = await jsigs.sign(mockCredential, {
        compactProof: false,
        documentLoader: testLoader.documentLoader.bind(testLoader),
        suite,
        purpose: new vc.CredentialIssuancePurpose()
    });
    console.log('credential', credential)

    return {credential, documentLoader, suite};
}

async function _generatePresentation({
                                         challenge, unsigned = false, credentialsCount = 1
                                     }) {
    const {didDocument, documentLoader: didLoader} = await _loadDid();
    testLoader.addLoader(didLoader);
    const credentials = [];

    // generate multiple credentials
    for (let i = 0; i < credentialsCount; i++) {
        const {credential} = await _generateCredential();
        credentials.push(credential);
    }

    const {documentLoader: dlc, suite: vcSuite} = await _generateCredential();
    testLoader.addLoader(dlc);

    const presentation = vc.createPresentation(
        {verifiableCredential: credentials});

    if (unsigned) {
        return {
            presentation, suite: vcSuite,
            documentLoader: testLoader.documentLoader.bind(testLoader)
        };
    }

    const authenticationKey = didDocument.methodFor({purpose: 'authentication'});

    const vpSuite = new Ed25519Signature2018({key: authenticationKey});

    const vp = await vc.signPresentation({
        presentation, suite: vpSuite, challenge,
        documentLoader: testLoader.documentLoader.bind(testLoader)
    });

    return {
        presentation: vp, suite: [vcSuite, vpSuite],
        documentLoader: testLoader.documentLoader.bind(testLoader)
    };
}

async function main() {
    const challenge = "1af"
    const {presentation, suite, documentLoader1} =
        await _generatePresentation({challenge});
    console.log('presentation', presentation);
    const result = await vc.verify({
        challenge,
        suite,
        documentLoader,
        presentation
    });
    console.log('result', result);
}

main()