using System;
using Bam.Net;
using Bam.Net.Presentation;
using Bam.Net.Services;
using System.IO;
using System.Linq;
using System.Linq.Expressions;
using System.Collections.Generic;
using System.Collections;

namespace Vimly.Plans
{
    public class Startup : IApp
    {

        public string[] GetPlanIds()
        {
            return ApplicationModel.CsvFiles["planIds"].ReadAllText().DelimitSplit("\r\n", true);
            // FileInfo[] files = ApplicationModel.DataDirectory.GetFiles();
            // List<string> list = new List<string>(files.Select(f=> f.Name));
            // list.Add(ApplicationModel.DataDirectory.FullName);
            // return list.ToArray();
        }

        public string[] GetPdfFilePaths()
        {
            return ApplicationModel.GetDataSubdirectory("pdf").GetFiles("*.pdf").Select(f=> f.FullName).ToArray();
        }
    }
}