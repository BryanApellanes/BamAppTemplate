using System;
using Bam.Net;
using Bam.Net.Presentation;
using Bam.Net.Services;
using Bam.Net.Server;
using Bam.Net.Application;
using System.IO;
using System.Linq;
using System.Linq.Expressions;
using System.Collections.Generic;
using System.Collections;

namespace Vimly.Plans
{
    public class Startup : IApplicationStartupHandler
    {
        public void Execute(AppConf appConf)
        {
            Console.WriteLine("Startup.Execute({0})", appConf.Name);
        }
    }
}