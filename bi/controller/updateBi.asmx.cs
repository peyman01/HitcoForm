using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Services;
using System.Threading.Tasks;
using Web_Services.DataAccess;

namespace Web_Services.controller
{
    /// <summary>
    /// Summary description for updateBi
    /// </summary>
    [WebService(Namespace = "http://tempuri.org/")]
    [WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
    [System.ComponentModel.ToolboxItem(false)]
    // To allow this Web Service to be called from script, using ASP.NET AJAX, uncomment the following line. 
    [System.Web.Script.Services.ScriptService]
    public class updateBi : System.Web.Services.WebService
    {
        [WebMethod]
        public void updateWebServicesDistributors()
        {
            // Simple check to test if the method is being called
            //System.Diagnostics.Debug.WriteLine("updateWebServicesDistributors method is being called");

            //// Commenting out all the time-consuming code to just test the method
            //try
            //{
            //    // Simulating a short operation
            //    System.Threading.Thread.Sleep(500); // Simulating a short delay of 500ms
            //}
            //catch (Exception ex)
            //{
            //    // Log the error if any
            //    System.Diagnostics.Debug.WriteLine("Error during execution: " + ex.Message);
            //}
            var exir = new Exir();
            try { exir.Sale_taminPharmed(); } catch { };
            try { exir.Sale_pakSalamat(); } catch { };
            try { exir.Sale_taminDarou(); } catch { };
            try { exir.Sale_rastaImen(); } catch { };
            try { exir.Sale_taminShafa(); } catch { };
            try { exir.Stock_taminPharmed(); } catch { };
            try { exir.Stock_pakSalamat(); } catch { };
            try { exir.Stock_rastaImen(); } catch { };
            try { exir.Stock_taminShafa(); } catch { };
            try { exir.Stock_taminDarou(); } catch { };

            var darouPakhsh = new DarouPakhash();
            try { darouPakhsh.Sale_taminPharmed(); } catch { };
            try { darouPakhsh.Sale_rastaImen(); } catch { };
            try { darouPakhsh.Sale_taminShafa(); } catch { };
            try { darouPakhsh.Stock_taminPharmed(); } catch { };
            try { darouPakhsh.Stock_rastaImen(); } catch { };
            try { darouPakhsh.Stock_taminShafa(); } catch { };
            
            var milan = new milan();
            try { milan.Sale_pakSalamat(); } catch { };
            try { milan.Sale_rastaImen(); } catch { };
            try { milan.Sale_taminDarou(); } catch { };
            try { milan.Sale_taminShafa(); } catch { };
            try { milan.Sale_taminPharmed(); } catch { };
            try { milan.Sale_aradCo(); } catch { };
            try { milan.Stock_pakSalamat(); } catch { };
            try { milan.Stock_rastaImen(); } catch { };
            try { milan.Stock_taminDarou(); } catch { };
            try { milan.Stock_taminShafa(); } catch { };
            try { milan.Stock_taminPharmed(); } catch { };
            try { milan.Stock_aradCo(); } catch { };
            
            var alborz = new alborz();
            try { alborz.Sale_rastaImen(); } catch { };
            try { alborz.Sale_taminPharmed(); } catch { };
            try { alborz.Sale_taminShafa(); } catch { };
            try { alborz.Sale_pakSalamat(); } catch { };
            try { alborz.Stock_rastaImen(); } catch { };
            try { alborz.Stock_taminPharmed(); } catch { };
            try { alborz.Stock_taminShafa(); } catch { };
            try { alborz.Stock_pakSalamat(); } catch { };
            
            var karen = new Karen();
            try { karen.Sale_pakSalamat(); } catch { };
            try { karen.Sale_taminPharmed(); } catch { };
            try { karen.Sale_rastaImen(); } catch { };
            try { karen.Stock_pakSalamat(); } catch { };
            try { karen.Stock_taminPharmed(); } catch { };
            try { karen.Stock_rastaImen(); } catch { };
            
            var dey = new Dey();
            try { dey.Sale_pakSalamat(); } catch { };
            try { dey.Stock_pakSalamat(); } catch { };
            
            var razi = new Razi();
            try { razi.Sale_pakSalamat(); } catch { };
            try { razi.Sale_rastaImen(); } catch { };
            try { razi.Sale_taminPharmed(); } catch { };
            try { razi.Sale_taminShafa(); } catch { };
            try { razi.Stock_pakSalamat(); } catch { };
            try { razi.Stock_rastaImen(); } catch { };
            try { razi.Stock_taminPharmed(); } catch { };
            try { razi.Stock_taminShafa(); } catch { };
            
            var mahya = new mahya();
            try { mahya.Sale_pakSalamat(); } catch { };
            try { mahya.Sale_rastaImen(); } catch { };
            try { mahya.Stock_pakSalamat(); } catch { };
            try { mahya.Stock_rastaImen(); } catch { };
            
            var shafaArad = new shafaArad();
            try { shafaArad.Sale_taminDarou(); } catch { };
            try { shafaArad.Sale_pakSalamat(); } catch { };
            try { shafaArad.Sale_taminPharmed(); } catch { };
            try { shafaArad.Sale_rastaImen(); } catch { };
            try { shafaArad.Sale_taminShafa(); } catch { };
            try { shafaArad.Stock_pakSalamat(); } catch { };
            try { shafaArad.Stock_taminPharmed(); } catch { };
            try { shafaArad.Stock_rastaImen(); } catch { };
            try { shafaArad.Stock_taminShafa(); } catch { };
            try { shafaArad.Stock_taminDarou(); } catch { };
            
            var daya = new Daya();
            try { daya.Sale_taminDarou(); } catch { };
            try { daya.Sale_taminPharmed(); } catch { };
            try { daya.Sale_pakSalamat(); } catch { };
            try { daya.Sale_rastaImen(); } catch { };
            try { daya.Stock_taminPharmed(); } catch { };
            try { daya.Stock_pakSalamat(); } catch { };
            try { daya.Stock_rastaImen(); } catch { };
            try { daya.Stock_taminDarou(); } catch { };
            
            var barij = new Barij();
            try { barij.Sale_pakSalamat(); } catch { };
            try { barij.Sale_rastaImen(); } catch { };
            try { barij.Sale_taminPharmed(); } catch { };
            try { barij.Sale_taminShafa(); } catch { };
            try { barij.Stock_pakSalamat(); } catch { };
            try { barij.Stock_rastaImen(); } catch { };
            try { barij.Stock_taminPharmed(); } catch { };
            try { barij.Stock_taminShafa(); } catch { };
        }
        [WebMethod]
        public void updateWebServicesDistributorsHejrat()
        {
            var hejrat = new Hejrat();
            try { hejrat.Sale_rastaImen(); } catch { };
            try { hejrat.Sale_pakSalamat(); } catch { };
            try { hejrat.Sale_taminShafa(); } catch { };
            try { hejrat.Sale_taminPharmed(); } catch { };
            try { hejrat.Stock_rastaImen(); } catch { };
            try { hejrat.Stock_pakSalamat(); } catch { };
            try { hejrat.Stock_taminShafa(); } catch { };
            try { hejrat.Stock_taminPharmed(); } catch { };
        }

        [WebMethod]
        public void updateFinance()
        {
            var financeRahkaran = new Finance();
            financeRahkaran.Sale_taminDarou();
            financeRahkaran.Sale_taminShafa();
            financeRahkaran.Sale_pakSalamat();
            financeRahkaran.Sale_taminPharmed();
            financeRahkaran.Sale_rastaImen();
            financeRahkaran.Sale_aradCo();                                   
            financeRahkaran.Sale_hitco();                                   
            financeRahkaran.Sale_ariaPharmed();
            financeRahkaran.Sale_zhoubin();


        }

    }
}
