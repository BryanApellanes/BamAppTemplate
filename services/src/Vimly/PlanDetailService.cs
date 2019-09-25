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
            bad
            return Application.CsvFiles["planIds"].ReadAllText().DelimitSplit("\r\n", true);
            // FileInfo[] files = ApplicationModel.DataDirectory.GetFiles();
            // List<string> list = new List<string>(files.Select(f=> f.Name));
            // list.Add(ApplicationModel.DataDirectory.FullName);
            // return list.ToArray();
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