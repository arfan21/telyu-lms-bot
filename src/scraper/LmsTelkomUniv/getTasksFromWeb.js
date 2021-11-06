const readSession = require("../../helpers/readSession");
const getSession = require("./getSession");
const fetch = require("node-fetch");
const readAccount = require("../../helpers/readAccount");

const fetchWrapper = async (n, dateBeforeUnix, dateAfterUnix) => {
    return new Promise(async (res) => {
        const sessions = await readSession();
        const accounts = await readAccount();
        const keyAccout = Object.keys(accounts);

        if (
            (n > 0 && !sessions) ||
            (n > 0 && Object.keys(sessions).length < 2)
        ) {
            for (let i = 0; i < keyAccout.length; i++) {
                console.log("Start writing session -> ", keyAccout[i]);
                await getSession(
                    keyAccout[i],
                    accounts[keyAccout[i]]?.email,
                    accounts[keyAccout[i]]?.password
                );
                console.log("Finish writing session,", keyAccout[i]);
            }

            n = n - 1;
            fetchWrapper(n, dateBeforeUnix, dateAfterUnix);
            return;
        }
        const keySessions = Object.keys(sessions);
        const allTasks = [];

        for (let i = 0; i < keySessions.length; i++) {
            console.log(
                `fetchActivity: START get all task from LMS API -> account `,
                keyAccout[i]
            );
            const sesskey = sessions[keySessions[i]].sesskey;
            const moodlesession = sessions[keySessions[i]].moodlesession.value;
            try {
                const responseRAW = await fetch(
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
                    }
                );

                const responseJSON = await responseRAW.json();

                if (responseJSON[0].error) {
                    console.log("ERROR FetchActivity: ", responseJSON);
                    throw responseJSON[0].error;
                } else {
                    console.log(
                        `fetchActivity: SUCCESS get all task from LMS API -> account `,
                        keyAccout[i]
                    );
                    allTasks.push(responseJSON[0].data.events);
                    if (i === keySessions.length - 1) {
                        console.log(
                            `fetchActivity: SUCCESS get all task completed`
                        );
                        res(allTasks);
                    }
                }
            } catch (error) {
                if (n > 0) {
                    console.log(`fetchActivity: retrying, attempt number ${n}`);
                    await getSession(
                        keyAccout[i],
                        accounts[keyAccout[i]]?.email,
                        accounts[keyAccout[i]]?.password
                    );

                    if (i === keySessions.length - 1) {
                        n = n - 1;
                        fetchWrapper(n, dateBeforeUnix, dateAfterUnix);
                    }
                } else {
                    res(null);
                    break;
                }
            }
        }
    });
};

module.exports = async () => {
    const dateBefore = new Date();
    dateBefore.setDate(dateBefore.getDate() - 1);
    const dateBeforeUnix = (dateBefore.getTime() / 1000).toFixed(0);

    const dateAfter = new Date();
    dateAfter.setDate(dateAfter.getDate() + 30);
    const dateAfterUnix = (dateAfter.getTime() / 1000).toFixed(0);

    try {
        console.log("fetch all tasks from LMS API ...");
        const dataTask = await fetchWrapper(3, dateBeforeUnix, dateAfterUnix);
        const resultData = [].concat.apply([], dataTask);
        console.log("SUCCESS : fetch all tasks from LMS API ...");
        return resultData;
    } catch (error) {
        return null;
    }
};
