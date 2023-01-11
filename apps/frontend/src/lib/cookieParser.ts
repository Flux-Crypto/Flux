export default function cookieParser(cookieString: string) {
    if (cookieString === "") return {};

    const pairs = cookieString.split(";");
    const splittedPairs = pairs.map((cookie: string) => cookie.split("="));
    console.log(splittedPairs);

    const cookieObj = splittedPairs.reduce((obj, cookie) => {
        obj[decodeURIComponent(cookie[0].trim())] = decodeURIComponent(
            cookie[1].trim()
        );

        return obj;
    }, {});

    return cookieObj;
}
