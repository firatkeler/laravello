export function gqlErrors(error) {
    const hasInternalError = errors => errors.some(error => error.internal);
    const replaceInternalError = (errors, error) => hasInternalError(errors) ? errors.filter(error => !error.internal).concat(error) : errors;

    return replaceInternalError((error?.graphQLErrors || []).map(error => {
        if (error.extensions?.category === "validation") {
            const validationErrors = error.extensions?.validation || {};
            Object.keys(validationErrors).map(validationError => validationErrors[validationError]);

            return Object.keys(validationErrors).map(validationError => validationErrors[validationError]).flat(1).map(validationError => ({
                message: validationError,
                internal: false
            }));
        }

        return {
            message: error.message,
            internal: Boolean(!error?.path)
        }
    }), {
        message: 'Something went wrong'
    }).flat(1);
}
