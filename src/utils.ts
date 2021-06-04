function PromiseSync(): { resolve: () => void, reject: (reason: any) => void, value: Promise<any> } {
    let result: any = {}

    const promise = new Promise((resolve, reject) => result = { resolve, reject });

    return { value: promise, resolve: result.resolve, reject: result.reject }
}

export { PromiseSync }