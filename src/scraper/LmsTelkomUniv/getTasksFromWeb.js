const readSession = require('../../helpers/readSession');
const getSession = require('./getSession');

const fetchWrapper = async (n, dateBeforeUnix, dateAfterUnix) => {
    return new Promise((res) => {
        const session = await readSession();
        const sesskey = session.sesskey;
        const moodlesession = session.moodlesession.value;

        try {
            const responseRAW = await fetch(
                `https://lms.telkomuniversity.ac.id/lib/ajax/service.php?sesskey=${sesskey}&info=core_calendar_get_action_events_by_timesort`,
                {
                    method: 'POST',
                    headers: {
                        Connection: 'keep-alive',
                        Accept: 'application/json, text/javascript, */*; q=0.01',
                        'X-Requested-With': 'XMLHttpRequest',
                        'User-Agent':
                            'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.152 Safari/537.36',
                        'Content-Type': 'application/json',
                        'Sec-GPC': '1',
                        Origin: 'https://lms.telkomuniversity.ac.id',
                        'Sec-Fetch-Site': 'same-origin',
                        'Sec-Fetch-Mode': 'cors',
                        'Sec-Fetch-Dest': 'empty',
                        Referer: 'https://lms.telkomuniversity.ac.id/my/',
                        'Accept-Language': 'en-US,en;q=0.9',
                        Cookie: `MoodleSession=${moodlesession}`,
                    },
                    body: JSON.stringify([
                        {
                            index: 0,
                            methodname:
                                'core_calendar_get_action_events_by_timesort',
                            args: {
                                limitnum: 26,
                                timesortfrom: dateBeforeUnix,
                                timesortto: dateAfterUnix,
                                limittononsuspendedevents: true,
                            },
                        },
                    ]),
                },
            );

            const responseJSON = await responseRAW.json();

            if (responseJSON[0].error) throw responseJSON[0].error;
            else res(responseJSON[0]);
        } catch (error) {
            if (n > 0) {
                console.log(`fetchActivity: retrying, attempt number ${n}`);
                await getSession();
                n = n - 1;
                fetchWrapper(n, dateBeforeUnix, dateAfterUnix);
            } else {
                res(null);
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
        console.log('fetch all tasks from LMS API ...');
        return await wrapper(3, dateBeforeUnix, dateAfterUnix);
    } catch (error) {
        return null;
    }
};
