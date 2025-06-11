/*global chrome*/
export const getListHistory = async () => {
    const hasPermission = await chrome.permissions.contains({permissions: ['history']});
    let domains = [];
    if (hasPermission) {
        const dataHistories = await chrome.history.search({maxResults: 1000, text: ""});
        for (let i = 0; i < dataHistories.length; i++) {
            const urlArray = dataHistories[i].url.split("/");
            if (["http:", "https:"].includes(urlArray[0])) {
                const visitCount = dataHistories[i].visitCount;
                const website = `${urlArray[0]}//${urlArray[2]}`;
                const index = domains.findIndex(item => item.website === website);
                if (index === -1) {
                    domains.push({website, visitCount})
                } else {
                    domains[index].visitCount = domains[index].visitCount + visitCount;
                }
            }
        }

        domains.sort((a, b) => b.visitCount - a.visitCount);
    }

    return domains
}