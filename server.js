import 'dotenv/config'
import express from 'express'
import {caching} from 'cache-manager';
import bodyParser from "body-parser";
import cors from "cors";
import {v4 as uuidv4} from 'uuid';

import * as EcdsaMultikey from '@digitalbazaar/ecdsa-multikey';
import {v4 as uuid} from 'uuid';
import * as vc from '@digitalbazaar/vc';
import * as ecdsaSd2023Cryptosuite from
        '@digitalbazaar/ecdsa-sd-2023-cryptosuite';
import {DataIntegrityProof} from '@digitalbazaar/data-integrity';

const {createSignCryptosuite} = ecdsaSd2023Cryptosuite;
import {dataloader} from "./dataloader.js";
import {credential} from "./credential.js";

const memoryCache = await caching('memory', {
    max: 100,
    ttl: 10 * 1000 /*milliseconds*/,
});
const app = express()
const port = process.env.PORT || 3162;
const url = process.env.URL || 'https://backend.hocptit.me'
app.use(cors());
app.use(bodyParser.json());
const apiVersion = '/v1'
const credCache = new Map();
// Root path
app.get('/', (req, res) => {
    res.send('Hello Avaxlunch!')
})

app.listen(port, () => {
    console.log(`Server start on: ${port}`)
})

export const mockKey = {
    type: 'Multikey',
    publicKeyMultibase: 'zDnaeSMnptAKpH4AD41vTkwzjznW7yNetdRh9FJn8bJsbsdbw',
    secretKeyMultibase: 'z42twirSb1PULt5Sg6gjgNMsdiLycu6fbA83aX1vVb8e3ncP'
};
const ecdsaKeyPair1 = await EcdsaMultikey.from(mockKey)
ecdsaKeyPair1.id = `did:avax:zDnaeSMnptAKpH4AD41vTkwzjznW7yNetdRh9FJn8bJsbsdbw`;
ecdsaKeyPair1.controller = `controller:zDnaeSMnptAKpH4AD41vTkwzjznW7yNetdRh9FJn8bJsbsdbw`;


// setup ecdsa-sd-2023 suite for signing selective disclosure VCs
const suite1 = new DataIntegrityProof({
    signer: ecdsaKeyPair1.signer(),
    cryptosuite: createSignCryptosuite({
        // require the `issuer` and `issuanceDate` fields to always be disclosed
        // by the holder (presenter)
        mandatoryPointers: [
            '/issuanceDate',
            '/issuer'
        ]
    })
});



// Issuer
app.post(`${apiVersion}/issue-credential`, async (req, res) => {
    try {
        const {holderDid, name} = req.body;
        if (!holderDid) {
            return res.send({
                error: 'holderDid is required',
                success: false,
            }).status(400);
        }
        const cred = JSON.parse(JSON.stringify(credential));
        // use a proof ID to enable it to be found and transformed into a disclosure
        // proof by the holder later
        const proofId1 = `urn:uuid:123123123`;
        suite1.proof = {id: proofId1};
        cred.credentialSubject.id = holderDid;
        cred.credentialSubject.name = name || 'Patrick Nguyen';
        const signedVC = await vc.issue({credential: cred, suite: suite1, documentLoader: dataloader});
        return res.send({
            data: JSON.stringify(signedVC),
            success: true,
        }).status(200);
    } catch (e) {
        console.log(e)
        res.send({
            error: e?.message,
            success: false,
        })
    }
});


// Verifier


// Holder


// Short URL
app.post(`${apiVersion}/short-url`, async (req, res) => {
    try {
        const {data} = req.body;
        const uuid = uuidv4();
        credCache.set(uuid, data);
        console.log(uuid)
        res.send({
            data: `${url}${apiVersion}/short-url/${uuid}`,
            success: true,
        })
    } catch (e) {
        console.log(e)
        res.send({
            error: e?.message,
            success: false,
        })
    }
});

app.get(`${apiVersion}/short-url/:uuid`, async (req, res) => {
    try {
        const {uuid} = req.params;
        console.log(uuid)
        const data = credCache.get(uuid);
        if (!data) {
            return res.send({
                error: 'Not found',
                success: false,
            })
        }
        res.send({
            data,
            success: true,
        })
    } catch (e) {
        console.log(e)
        res.send({
            error: e?.message,
            success: false,
        })
    }
});