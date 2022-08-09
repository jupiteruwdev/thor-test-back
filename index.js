const express = require('express')
const cors = require('cors')
const ethers = require('ethers')
const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const utils = require('ethereumjs-utils')

const app = express()
app.use(cors())
app.use(express.json())
app.post('/authenticate', (req, res, next) => {
  const { signature, message, address } = req.body
  const verifiedAddress = ethers.utils.verifyMessage(
    ethers.utils.arrayify(message),
    signature,
  )

  if (verifiedAddress.toLowerCase() === address.toLowerCase()) {
    const token = jwt.sign(
      {
        message,
        signature,
      },
      'test-secret',
      {
        expiresIn: '1h',
      },
    )

    res.json({ token })
  } else {
    res.status(400).send({ error: 'invalid signature' })
  }
})

app.get('/hash/:wallet', (req, res, next) => {
  try {
    const { wallet } = req.params
    const timestamp = new Date().getTime()
    const hash = crypto
      .createHash('md5')
      .update(`${wallet}-${timestamp}`)
      .digest('hex')

    res.json({
      hash,
    })
  } catch (err) {
    throw err
  }
})

app.listen(8080, () => {
  console.log('Server is listening on port 8080')
})
