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

        public object[] GetPlanIds()
        {
            HashSet<string> uniqueIds = new HashSet<string>();
            Application.CsvFiles["planIds"].ReadAllText().DelimitSplit("\r\n", true).Each(s => uniqueIds.Add(s));
            return uniqueIds.Select(id => new {PlanId = id}).ToArray();
        }
        public object[] GetPdfFilePaths()
        {
            return Application.GetDataSubdirectory("pdf").GetFiles("*.pdf").Select(f => new {FilePath = f.FullName}).ToArray();
        }

        public object[] GetPdfFileNames()
        {
            return Application.GetDataSubdirectory("pdf").GetFiles("*.pdf").Select(f => new {FileName = f.Name}).ToArray();
        }

        public object[] GetMappings(string fileName)
        {
            FileInfo mappingFile = Application.GetDataFile("csv", "Mappings", fileName);
            string allText = mappingFile.ReadAllText();
            return allText.DelimitSplit(new string[]{"\r", "\n"}, true).Select(line => 
            {
                if(!string.IsNullOrEmpty(line))
                {
                    string[] values = line.DelimitSplit(",", true);
                    return new {DocumentName = values[0], PlanId = values[1], EffectiveDate = values[2]};
                }
                return null;
            }).Where(o => o != null).ToArray();
        }

        public ProductInfo[] GetFixedProductLinks()
        {
            FileInfo linkFile = Application.GetDataFile("json", "fixedLinks.json");
            return linkFile.FromJsonFile<ProductInfo[]>();
        }
    }
}