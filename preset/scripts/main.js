const vm = new Vue({
    el: "#app",
    data: {
        name: "preset",
        mode1: "OFFICE",
        mode2: "EXTRACT",
        selector: {
            mode1: [
                "OFFICE"
            ],
            mode2: [
                "EXTRACT",
                "ALIGN",
                "COUNT",
            ]
        }
    },
    computed: {
        preset() {
            return {
                mode: `${this.mode1}:${this.mode2}`,
                console: false,
                outputFile: "",
                sourceFiles: "",
                targetFiles: "",
                office: {
                    common: {

                    },
                    word: {

                    },
                    excel: {

                    },
                    ppt: {
                        
                    },
                },
                cat: {

                },
                wwc: {

                },
                debug: false
            }
        },
    }
})