using System;
using Bam.Net;
using Bam.Net.Presentation;
using Bam.Net.Services;
using Bam.Net.Server;
using System.IO;
using System.Linq;
using System.Linq.Expressions;
using System.Collections.Generic;
using System.Collections;

namespace Vimly.Plans
{
    [Proxy("planDetails")]
    public class PlanDetailService
    {
        [Inject]
        public ApplicationModel Application {get;set;}

        public string[] GetPlanIds()
        {
            HashSet<string> uniqueIds = new HashSet<string>();
            Application.CsvFiles["planIds"].ReadAllText().DelimitSplit("\r\n", true).Each(s => uniqueIds.Add(s));
            return uniqueIds.ToArray();
        }

        public string[] GetPdfFilePaths()
        {
            return Application.GetDataSubdirectory("pdf").GetFiles("*.pdf").Select(f => f.FullName).ToArray();
        }

        public string[] GetPdfFileNames()
        {
            return Application.GetDataSubdirectory("pdf").GetFiles("*.pdf").Select(f => f.Name).ToArray();
        }
    }
}