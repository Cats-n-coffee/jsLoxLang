function createEnvId() {
    return require('crypto').randomBytes(3).toString('hex');
}

module.exports = { createEnvId }