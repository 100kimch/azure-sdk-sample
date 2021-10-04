// The default credential first checks environment variables for configuration as described above.
// If environment configuration is incomplete, it will try managed identity.

// Azure Key Vault service to use
// const { KeyClient } = require("@azure/keyvault-keys");

// Azure authentication library to access Azure Key Vault
const { DefaultAzureCredential } = require("@azure/identity");

// Azure SDK clients accept the credential as a parameter
const credential = new DefaultAzureCredential();

console.log('credential: ', credential);

// Create authenticated client
// const client = new KeyClient(vaultUrl, credential);

// Use service from authenticated client
// const getResult = await client.getKey("MyKeyName");