(async () => {
    const core = require('@actions/core');
    const axios = require('axios');

    try {
        const now = new Date();

        // Download schedule json
        const nodeScheduleUrl = 'https://raw.githubusercontent.com/nodejs/Release/master/schedule.json';
        let {data} = await axios.get(nodeScheduleUrl);

        // Filter out old or unreleased versions
        data = Object.entries(data).filter(
            ([_, {end, start}]) => new Date(start) < now && now < new Date(end)
        );

        // Find latest lts version
        let ltsVersion = null;
        for (const [key, {lts}] of data) {
            if (lts !== undefined && new Date(lts) < now) {
                ltsVersion = key;
            }
        }

        const repo = core.getInput('repo');
        const matrix = {"include": []};

        // Push entries to matrix
        for (const [key, _] of data) {
            const node_version = key.replace(/^v/, '');
            let extra_tags = '';
            if (key === ltsVersion) {
                extra_tags += `\n${repo}:lts`;
            }
            matrix.include.push({node_version, extra_tags});
        }

        // Mark last version as latest
        matrix.include[matrix.include.length - 1].extra_tags += `\n${repo}:latest`;

        core.setOutput('matrix', matrix);
    } catch (error) {
        core.setFailed(error.message);
    }
})();
