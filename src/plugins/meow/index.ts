/* eslint-disable simple-header/header */
/*
 * Vencord, a Discord client mod
 * Copyright (c) 2023 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import {
    addPreSendListener,
    MessageObject,
    removePreSendListener
} from "@api/MessageEvents";
import definePlugin from "@utils/types";

export default definePlugin({
    name: "Meow",
    description: "にゃー",
    authors: [],
    dependencies: ["MessageEventsAPI"],

    onSend(msg: MessageObject) {
        let input = msg.content;
        let str = "";
        let str2 = "";
        let output = "";
        let escapingEscape = false;
        let inEscape = false;
        let escapeStr = "";
        let matchCount = 0;
        input = input.replace(/ﾃﾞｭ/g, "ﾆｬ").replace(/ﾙﾝ/g, "ﾆｬﾝ");
        for (let i = 0; i < input.length + 1; i++) {
            {
                const url = /^https?:\/\/.*(?<![\s$])/.exec(input.slice(i))?.[0] || "";
                if (url) {
                    str2 += url + " ";
                    i += url.length - 1;
                    matchCount++;
                    continue;
                }
            }
            const char = input[i];
            if (char === "`" && !escapingEscape) {
                if (inEscape) {
                    if (/^`*/.exec(input.slice(i))![0].startsWith(escapeStr)) {
                        inEscape = false;
                        str2 += escapeStr;
                        i += escapeStr.length - 1;
                        matchCount++;
                        continue;
                    }
                } else {
                    escapeStr = /^`*/.exec(input.slice(i))![0];
                    str2 += escapeStr;
                    i += escapeStr.length - 1;
                    inEscape = true;
                    matchCount++;
                    continue;
                }
            }
            if (char === "<" && !escapingEscape) {
                const mention = /.*>/.exec(input.slice(i))![0];
                if (mention) {
                    str2 += mention;
                    i += mention.length - 1;
                    matchCount++;
                    continue;
                }
            }
            escapingEscape = false;
            if (char === "\\") {
                escapingEscape = true;
            }
            if (!inEscape && char && /[ぁ-んァ-ヶｦ-ﾝｱ-ﾝﾞﾟ一-龠0-9a-zA-Z０-９ａ-ｚＡ-Ｚー]/.test(char)) {
                str += char;
                matchCount++;
            } else {
                if (str) {
                    const www = /[wｗＷ]{3,}$/.exec(str)?.[0] || "";
                    const str3 = www.length === 0 ? str : str.slice(0, -www.length);
                    output += (/ね$/.test(str3) ? (str3.slice(0, -1) + "にゃね") : (str3.replace(/[(な)(にゃ)]$/, "") + "にゃ")) + www;
                }
                output += str2;
                output += char || "";
                str = "";
                str2 = "";
            }
        }
        if (matchCount === 0) output = "にゃー" + output;
        msg.content = output;
    },

    start() {
        this.preSend = addPreSendListener((_, msg) => this.onSend(msg));
    },

    stop() {
        removePreSendListener(this.preSend);
    },
});
