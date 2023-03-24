# Defi API

_npm install & npm start_

1. Authorization

```javascript
Request
curl --location --request POST 'localhost:5000/auth/login?username=foo&password=bar'
```

```javascript
Response
{
    "success": true,
    "message": "Authentication successful",
    "user": {
        "username": "foo"
    },
    "token": "YOUR_TOKEN",
    "expirationDate": 1663227459
}
```

2. Request for a account's NFT

```javascript
Request
curl --location --request GET 'localhost:5000/api/nft/[ACCOUNT_ID]' --header 'Authorization: bearer [YOUR_TOKEN]'
```

```javascript
Response
{
    "godfathers": [
        {
            "seasonNumber": 1,
            "ticketType": 6,
            "rarity": 1,
            "ticketNumber": 4649880
        },
        {
            "seasonNumber": 1,
            "ticketType": 6,
            "rarity": 1,
            "ticketNumber": 4619803
        }
    ],
    "puppys": [
        {
            "seasonNumber": 1,
            "ticketType": 2,
            "pack": 0,
            "ticketNumber": 4
        },
        {
            "seasonNumber": 1,
            "ticketType": 2,
            "pack": 0,
            "ticketNumber": 12
        }
    ]
}
```

3. Get Godfarher Image

```
localhost:5000/api/nft/godfather/[ticketNumber]?rarity=[rarity]&token=[YOUR_TOKEN]
```

4. Get Puppy Image

```
localhost:5000/api/nft/puppy/[ticketNumber]?pack=[pack]&token=[YOUR_TOKEN]
```
