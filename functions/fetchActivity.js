var originalFetch = require("isomorphic-fetch");
const fetch = require("fetch-retry")(originalFetch);
const getLMSsession = require("../configs/getLMSsession");
module.exports = async (sesskey, moodlesession) => {
    const dateBefore = new Date();
    dateBefore.setDate(dateBefore.getDate() - 1);
    const dateBeforeUnix = (dateBefore.getTime() / 1000).toFixed(0);

    const dateAfter = new Date();
    dateAfter.setDate(dateAfter.getDate() + 7);
    const dateAfterUnix = (dateAfter.getTime() / 1000).toFixed(0);

    return new Promise((resolve, reject) => {
        fetch(
            `https://lms.telkomuniversity.ac.id/lib/ajax/service.php?sesskey=${sesskey}&info=core_calendar_get_action_events_by_timesort`,
            {
                method: "POST",
                headers: {
                    Connection: "keep-alive",
                    Accept: "application/json, text/javascript, */*; q=0.01",
                    "X-Requested-With": "XMLHttpRequest",
                    "User-Agent":
                        "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.152 Safari/537.36",
                    "Content-Type": "application/json",
                    "Sec-GPC": "1",
                    Origin: "https://lms.telkomuniversity.ac.id",
                    "Sec-Fetch-Site": "same-origin",
                    "Sec-Fetch-Mode": "cors",
                    "Sec-Fetch-Dest": "empty",
                    Referer: "https://lms.telkomuniversity.ac.id/my/",
                    "Accept-Language": "en-US,en;q=0.9",
                    Cookie: `MoodleSession=${moodlesession}`,
                },
                body: JSON.stringify([
                    {
                        index: 0,
                        methodname:
                            "core_calendar_get_action_events_by_timesort",
                        args: {
                            limitnum: 26,
                            timesortfrom: dateBeforeUnix,
                            timesortto: dateAfterUnix,
                            limittononsuspendedevents: true,
                        },
                    },
                ]),
                retryOn: async (attempt, error, res) => {
                    if (attempt > 3) return false;

                    const resJSON = await res.json();
                    if (resJSON[0].error) {
                        await getLMSsession();
                        console.log(`retrying, attempt number ${attempt + 1}`);
                        return true;
                    }

                    if (error !== null) {
                        console.log(`retrying, attempt number ${attempt + 1}`);
                        return true;
                    }
                    return res;
                },
            }
        )
            .then((result) => result.json())
            .then(async (res) => {
                if (res[0].error) {
                    await getLMSsession();
                    reject(res[0]);
                }
                resolve(res[0]);
            })
            .catch((err) => {
                reject(err);
            });
    });
};
