/**
 * Funciones para operaciones de consulta al servidor.
 */

const RESULT_OK = 0x1;
const RESULT_AUTH_FAILED = 0x2;
const RESULT_UNKNOWN = 0x3;

/**
 * Obtiene el resultado de la operación desde los metadatos.
 * @param metadata Metadatos de operación.
 * @returns {number} Código de resultado de la operación.
 */
function checkOperationResult(metadata) {
    console.log("Operación -> Id: {0} | DT: {1} | Descr: '{2}'.".format(metadata.operationID, metadata, metadata.datetime, metadata.description));

    switch (metadata.operationResult) {
        case "DONE":
            return RESULT_OK;
        case "AUTHENTICATION_FAILED":
            return RESULT_AUTH_FAILED;
        case "UNKNOWN_EXCEPTION":
            return RESULT_UNKNOWN;
    }
}