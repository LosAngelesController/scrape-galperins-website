
import editJsonFile from 'edit-json-file'


const fileaudits = editJsonFile('./auditsexport.json')

const fileauditscleaned = editJsonFile('./auditsexportcleaned.json')


const audits = fileaudits.get('audits')

audits.forEach((eachaudit) => {

    var permalink = eachaudit.link.replace("https://lacontroller.org/audits-and-reports/", "/audits/").replace(/\/$/, '')

    eachaudit.permalink = permalink;

    fileauditscleaned.set(`audits.${permalink}`, eachaudit)
})

fileauditscleaned.save()