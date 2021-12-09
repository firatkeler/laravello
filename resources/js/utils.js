export function gqlErrors(error) {
    const hasInternalError = errors => errors.some(error => error.internal);
    const replaceInternalError = (errors, error) => hasInternalError(errors) ? errors.filter(error => !error.internal).concat(error) : errors;

    if (error?.networkError && error.networkError.statusCode === 419) {
        throw new AuthError('Unauthenticated!');
    }

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

export class AuthError extends Error {

}

export const colorMap500 = {
    teal: "bg-teal-500",
    orange: "bg-orange-500",
    gray: "bg-gray-500",
    yellow: "bg-yellow-500",
    purple: "bg-purple-500",
    red: "bg-red-500",
    green: "bg-green-500",
    blue: "bg-blue-500",
    indigo: "bg-indigo-500"
};

export const colorMap100 = {
    teal: "bg-teal-100",
    orange: "bg-orange-100",
    gray: "bg-gray-100",
    yellow: "bg-yellow-100",
    purple: "bg-purple-100",
    red: "bg-red-100",
    green: "bg-green-100",
    blue: "bg-blue-100",
    indigo: "bg-indigo-100"
};

export const colorMap200 = {
    teal: "bg-teal-200",
    orange: "bg-orange-200",
    gray: "bg-gray-200",
    yellow: "bg-yellow-200",
    purple: "bg-purple-200",
    red: "bg-red-200",
    green: "bg-green-200",
    blue: "bg-blue-200",
    indigo: "bg-indigo-200"
};

export const colorGrid = [
    ["teal", "orange", "gray"],
    ["yellow", "purple", "red"],
    ["green", "blue", "indigo"]
];
