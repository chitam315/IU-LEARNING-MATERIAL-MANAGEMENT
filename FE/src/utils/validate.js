/**
 * 
 * 
 * const rules = {
        name: [
            {require: true, message: "khong duoc de trong"}
        ],
        email: [
            {require: true},
            {regex: 'phone', message: "khong dung cu phap"},
            {reEnter: 'password', message:'khong giong mat khau'}
        ]
    }
 */
export const validate = (rules, form) => {
    // const [state,setState] = useState({})
    let errObj = {}
    let messageError = {
        require: "This value is required",
        regex: "This value is not correct the format",
        minMax: (min, max) => `Please input from ${min}${max ? '-' + max : ''} character`,
        reEnter: "This value is not same with above value",
    }
    const REGEXP = {
        phone: /(84|0[3|5|7|8|9])+([0-9]{8})\b/,
        email: /^[a-z][a-z0-9_\.]{5,32}@[a-z0-9]{2,}(\.[a-z0-9]{2,4}){1,2}$/,
        website: /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/,
        facebook: /(?:https?:\/\/)?(?:www\.)?(mbasic.facebook|m\.facebook|facebook|fb)\.(com|me)\/(?:(?:\w\.)*#!\/)?(?:pages\/)?(?:[\w\-\.]*\/)*([\w\-\.]*)/
    }
    for (const name in rules) {
        for (const rule of rules[name]) {

            if (rule.require ) {
                if ((typeof form[name] != 'boolean' && !form[name]?.trim()) || (typeof form[name] == 'boolean' && !form[name])) {
                    errObj[name] = rule.message || messageError.require
                    break
                }
            }

            if (form[name] && rule.regex) {
                let regexp = rule.regex
                if (regexp in REGEXP) {
                    regexp = REGEXP[regexp]
                } else if (!(regexp instanceof RegExp)) {
                    regexp = new RegExp()
                }
                if (!regexp.test(form[name])) errObj[name] = rule.message || messageError.regex
            }

            if ((rule.min || rule.max) && form[name]) {
                // console.log('form[' + name + '] is : ' + form[name]);
                if (form[name].length < rule.min || form[name].length > rule.max) {
                    errObj[name] = rule.message || messageError.minMax(rule.min, rule.max)
                }
            }

            if (form[name] && rule.reEnter) {
                // console.log('reEnter : ', rule.reEnter);
                let valueCompare = form[rule.reEnter]
                // console.log(valueCompare, form[name]);
                if (form[name] != valueCompare) {
                    errObj[name] = rule.message || messageError.reEnter
                }
            }
        }
    }

    return errObj
}

export const required = (message) => ({
    message,
    require: true,
})

/**
 * 
 * phone,email,website,facebook
 */
export const regexp = (pattern, message) => ({
    message,
    regex: pattern
})

export const minMax = (min, max, message) => ({ min, max, message })

/**
 * 
 * @param field  : enter name of field you want to compare
 * @param {*} message 
 * @returns 
 */
export const reEnter = (field, message) => ({
    message,
    reEnter: field
})