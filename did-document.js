export const issuer1 = {
    '@context':
        [
            'https://www.w3.org/ns/did/v1',
            'https://w3id.org/veres-one/v1',
            'https://w3id.org/security/suites/ed25519-2020/v1',
            'https://w3id.org/security/suites/x25519-2020/v1'
        ],
    id:
        'did:avax:zDnaeWzcHdM7gTqVhGY2n8TSf9UKDWoh9rT2YdoWGpsycr9DJ',
    capabilityInvocation:
        [
            {
                id: 'did:avax:zDnaeWzcHdM7gTqVhGY2n8TSf9UKDWoh9rT2YdoWGpsycr9DJ',
                type: 'Ed25519VerificationKey2020',
                controller: 'did:avax:zDnaeWzcHdM7gTqVhGY2n8TSf9UKDWoh9rT2YdoWGpsycr9DJ',
                publicKeyMultibase: 'zDnaeWzcHdM7gTqVhGY2n8TSf9UKDWoh9rT2YdoWGpsycr9DJ'
            }
        ],
    authentication:
        [
            'did:avax:zDnaeWzcHdM7gTqVhGY2n8TSf9UKDWoh9rT2YdoWGpsycr9DJ#zDnaeWzcHdM7gTqVhGY2n8TSf9UKDWoh9rT2YdoWGpsycr9DJ'
        ],
    assertionMethod:
        [
            'did:avax:zDnaeWzcHdM7gTqVhGY2n8TSf9UKDWoh9rT2YdoWGpsycr9DJ#zDnaeWzcHdM7gTqVhGY2n8TSf9UKDWoh9rT2YdoWGpsycr9DJ'
        ],
    capabilityDelegation:
        [
            'did:avax:zDnaeWzcHdM7gTqVhGY2n8TSf9UKDWoh9rT2YdoWGpsycr9DJ#zDnaeWzcHdM7gTqVhGY2n8TSf9UKDWoh9rT2YdoWGpsycr9DJ'
        ],
    keyAgreement:
        [
            {
                id: 'did:avax:zDnaeWzcHdM7gTqVhGY2n8TSf9UKDWoh9rT2YdoWGpsycr9DJ#z6LShs9GGnqk85isEBzzshkuVWrVKsRp24GnDuHk8QWkARMW',
                type: 'X25519KeyAgreementKey2020',
                controller: 'did:avax:zDnaeWzcHdM7gTqVhGY2n8TSf9UKDWoh9rT2YdoWGpsycr9DJ',
                publicKeyMultibase: 'z6LShs9GGnqk85isEBzzshkuVWrVKsRp24GnDuHk8QWkARMW'
            }
        ]
}

export const holder1 = {
    '@context': [
        'https://www.w3.org/ns/did/v1',
        'https://w3id.org/veres-one/v1',
        'https://w3id.org/security/suites/ed25519-2020/v1',
        'https://w3id.org/security/suites/x25519-2020/v1'
    ],
    id: 'did:avax:zDnaeSMnptAKpH4AD41vTkwzjznW7yNetdRh9FJn8bJsbsdbw',
    capabilityInvocation: [
        {
            id: 'did:avax:zDnaeSMnptAKpH4AD41vTkwzjznW7yNetdRh9FJn8bJsbsdbw#zDnaeSMnptAKpH4AD41vTkwzjznW7yNetdRh9FJn8bJsbsdbw',
            type: 'Ed25519VerificationKey2020',
            controller: 'did:avax:zDnaeSMnptAKpH4AD41vTkwzjznW7yNetdRh9FJn8bJsbsdbw',
            publicKeyMultibase: 'zDnaeSMnptAKpH4AD41vTkwzjznW7yNetdRh9FJn8bJsbsdbw'
        }
    ],
    authentication: [
        'did:avax:zDnaeSMnptAKpH4AD41vTkwzjznW7yNetdRh9FJn8bJsbsdbw#zDnaeSMnptAKpH4AD41vTkwzjznW7yNetdRh9FJn8bJsbsdbw'
    ],
    assertionMethod: [
        'did:avax:zDnaeSMnptAKpH4AD41vTkwzjznW7yNetdRh9FJn8bJsbsdbw#zDnaeSMnptAKpH4AD41vTkwzjznW7yNetdRh9FJn8bJsbsdbw'
    ],
    capabilityDelegation: [
        'did:avax:zDnaeSMnptAKpH4AD41vTkwzjznW7yNetdRh9FJn8bJsbsdbw#zDnaeSMnptAKpH4AD41vTkwzjznW7yNetdRh9FJn8bJsbsdbw '
    ],
    keyAgreement: [
        {
            id: 'did:avax:zDnaeSMnptAKpH4AD41vTkwzjznW7yNetdRh9FJn8bJsbsdbw#z6LShs9GGnqk85isEBzzshkuVWrVKsRp24GnDuHk8QWkARMW',
            type: 'X25519KeyAgreementKey2020',
            controller: 'did:avax:zDnaeSMnptAKpH4AD41vTkwzjznW7yNetdRh9FJn8bJsbsdbw',
            publicKeyMultibase: 'z6LShs9GGnqk85isEBzzshkuVWrVKsRp24GnDuHk8QWkARMW'
        }
    ]
}
