import './env.ts';

// // import Azure npm dependency for Identity credential method
// import {
//     AzureCliCredential, DefaultAzureCredential, EnvironmentCredential, ManagedIdentityCredential,
//     VisualStudioCodeCredential
// } from '@azure/identity';
// import { SecretClient } from '@azure/keyvault-secrets';
// const keyVaultName = process.env["AZURE_KEY_VAULT_NAME"];
// console.log('keyVault: ', keyVaultName, process.env["AZURE_SUBSCRIPTION_ID"]);
// const KVUri = "https://" + keyVaultName + ".vault.azure.net";
// const credential = new DefaultAzureCredential();
// const client = new SecretClient(KVUri, credential);
// console.log('credential: ', credential, client);
import { BlobServiceClient, ContainerItem } from '@azure/storage-blob';

function getServiceSasUrl() {
    return (document.getElementById("serviceSasUrl") as HTMLInputElement).value;
}

function showContainerList(containers: ContainerItem[]) {
    const outputEl = document.getElementById("output");
    if (outputEl) {
        // empty previous output
        outputEl.textContent = "";
        for (const container of containers) {
            const containerDiv = document.createElement("div");
            containerDiv.textContent = container.name;
            outputEl.appendChild(containerDiv);
        }
    }
}

async function listContainers() {
    const blobServiceClient = new BlobServiceClient(getServiceSasUrl());
    const containers = [];
    for await (const container of  blobServiceClient.listContainers()) {
        containers.push(container);
    }
    showContainerList(containers);

}

window.addEventListener("DOMContentLoaded", () => {
    const listContainersButton = document.getElementById("listContainers");
    if (listContainersButton) {
        listContainersButton.addEventListener("click", () => listContainers());
    }
});

// import { BlobServiceClient, ContainerItem } from '@azure/storage-blob';

// function getServiceSasUrl() {
//     return (document.getElementById("serviceSasUrl") as HTMLInputElement).value;
// }

// function showContainerList(containers: ContainerItem[]) {
//     const outputEl = document.getElementById("output");
//     if (outputEl) {
//         // empty previous output
//         outputEl.textContent = "";
//         for (const container of containers) {
//             const containerDiv = document.createElement("div");
//             containerDiv.textContent = container.name;
//             outputEl.appendChild(containerDiv);
//         }
//     }
// }

// async function listContainers() {
//     const blobServiceClient = new BlobServiceClient(getServiceSasUrl());
//     const containers = [];
//     for await (const container of  blobServiceClient.listContainers()) {
//         containers.push(container);
//     }
//     showContainerList(containers);

// }

// window.addEventListener("DOMContentLoaded", () => {
//     const listContainersButton = document.getElementById("listContainers");
//     if (listContainersButton) {
//         listContainersButton.addEventListener("click", () => listContainers());
//     }
// });
