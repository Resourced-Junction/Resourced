# Resourced

A way to have persistent data on streamr streams and data unions

## Why?

Currently streamr streams allow only to share real time data using in a trustless way. For our dapp we needed to persist the data for
long time (for example 2 years) and maybe modify it.
One solution for this is https://redstone.finance/ but while it caches information for long term it still requires you to trust the persistor
(called by them as oracles) as they handle the data offchain to have propper performance.
For this reason we created our own persistors, which solve two problems

- trust in persistor
- perfromance
  To solve these we share the data encrypted over a P2P network (GUN), which allows us to write and read data in ms and retribute all the
  relevant contributers and streaming through utilizing the streamr streams.

## Implementation

Current implementation has three parties: publishers, persistors and subscribers. These are separate application under the corresponding folders and would be run by separate parties.

### Publisher

Publishers publish their data. Publishers can go offline after publishing.
The data is first encrypted and published in the Gun network, then the address of the data and the encryption key is sent to the stream to be cached by the persistor.

### Persistor

The job of the persistors is to persist the address and encryption key on the stream. They subscribe to the stream to listen to new pairs and also publish all the pairs they have seen once per second.

### Subscriber

Subscribers want to see new and historical data. They subscribe to the stream and will get all the address and encryption key pairs thus far when a persistor echoes them. With the address the subscriber can get the data from GUN and decrypt it with the corresponding key.

### Stream structure

Messages will have the following structure with a variable count of data elements.
Address field is the key to get the data from GUN and key field is the encryption key for that data.

```json
{
  "data": [
    {
      "address": "string",
      "key": "string"
    },
    {
      "address": "string",
      "key": "string"
    }
  ]
}
```

### Gun network

Gun is a protocol for P2P network, which can handle end2end encryption, so that the peers don't know what is inside the documents.
Through this we are able to implement a decentralized persistor flow maintaining the trustlessness of web3 and the performance of web2.

## What should be done in the future

The next steps for the persistor flow

### Authentication

right now files are uploaded encrypted in the Gun network, this will change in the future by implementing
authentication in the network, giving write priviledges to the owner of the files, so that persistor can operate fully trustless.

### Smart contract

right now the stream can be subscribed for free, this will change in the future, user outside the data union would have to pay for
the stream. Because our network requires the constant contribution of persistor, it is necessary to retribute their work, this would be done
by giving a percentage of the sales to the persistor.
The idea is that persistors and publisher register themselves in the data union with their roles ("persistor", "publisher").
Each time that a subscriber buys the data the money is then divided between protocol fee, admin fee, persistors and publishers.

### Network optimization

the network would be optimized by firing up the persistor only when the stream has been bought. So the persistor would constantly
listen to the state of the smartcontract, then if someone bought the stream, then would start to stream the data for the time bought from the user.
