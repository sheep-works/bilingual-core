const vm = new Vue({
    el: "#app",
    data: {
        name: "preset",
        mode1: "OFFICE",
        mode2: "EXTRACT",
        outputFile: "result",
        ext: "",
        sourceFiles: "",
        targetFiles: "",
        common: {
            segmentation: true,
            delimiters: "(。|！|？|(\\. )|(\\! )|(\\? ))",
            excluding: false,
            excludePattern: "^[０-９0-9]+$",
            withSeparator: false
        },
        office: {
            word: {
                afterRev: true,
                afterRev2: true
            },
            excel: {
                readFilledCell: true,
                readHiddenSheet: false
            },
            ppt: {
                readSlide: true,
                readNote: true
            },
        },
        wwc: {
            dupli: 1,
            over95: 1,
            over85: 1,
            over75: 1,
            over50: 1,
            under49: 1
        },
        selector: {
            mode1: [
                "OFFICE"
            ],
            mode2ForOffice: [
                "EXTRACT",
                "ALIGN",
                "COUNT",
            ],
            extentionForExtract: [
                "txt",
                "json",
                "console"
            ],
            extentionForAlign: [
                "tsv"
            ],
            extentionForCount: [
                "tsv",
                "csv"
            ]
        }
    },
    computed: {
        preset() {
            const data = {
                mode: `${this.mode1}:${this.mode2}`,
                console: false,
                outputFile: `${this.outputFile}.${this.ext}`,
                sourceFiles: this.sourceFiles,
                targetFiles: this.targetFiles,
                common: {
                    segmentation: this.common.segmentation,
                    delimiters: this.common.ddelimiters,
                    excluding: this.common.excluding,
                    excludePattern: this.common.excludePattern,
                    withSeparator: this.common.withSeparator
                },
                office: {
                    word: {
                        afterRev: this.office.word.afterRev,
                        afterRev2: this.office.word.afterRev2
                    },
                    excel: {
                        readFilledCell: this.office.excel.readFilledCell,
                        readHiddenSheet: this.office.excel.readHiddenSheet
                    },
                    ppt: {
                        readSlide: this.office.ppt.readSlide,
                        readNote: this.office.ppt.readNote
                    },
                },
                cat: {

                },
                wwc: {
                    dupli: this.wwc.dupli,
                    over95: this.wwc.over95,
                    over85: this.wwc.over85,
                    over75: this.wwc.over75,
                    over50: this.wwc.over50,
                    under49: this.wwc.under49
                },
                debug: false
            }
            return JSON.stringify(data, null, 2)
        },
        mode2Opts() {
            return this.mode1 === "OFFICE" ? this.selector.mode2ForOffice : []
        },
        extOpts() {
            switch (this.mode2) {
                case "EXTRACT":
                    return this.selector.extentionForExtract

                case "ALIGN":
                    return this.selector.extentionForAlign

                case "COUNT":
                    return this.selector.extentionForCount

                default:
                    return []
            }

        }
    },
    methods: {
        setDefaultMode2() {
            this.mode2 = this.mode2Opts[0] || ""
            this.setDefaultExtension()
        },
        setDefaultExtension() {
            this.ext = this.extOpts[0] || ""
        },
        copyConfig() {
            navigator.clipboard.writeText(this.preset)
        }
    },
    mounted() {
        this.setDefaultMode2()
    }
})