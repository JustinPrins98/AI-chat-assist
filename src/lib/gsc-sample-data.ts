// --- GSC: example dataset with campaign impact & query shifts ---
export const gscExampleData = {
  dimensionHeaders: [
    { name: "date" },
    { name: "page" },
    { name: "query" }
  ],
  metricHeaders: [
    { name: "clicks" },
    { name: "impressions" },
    { name: "ctr" },       // ratio (clicks/impressions)
    { name: "position" }   // average position
  ],
  rows: [
    // Baseline
    { dimensionValues: [{ value: "20240701" }, { value: "/" },               { value: "brand name" }],       metricValues: [{ value: "120" }, { value: "1000" }, { value: "0.12" },  { value: "3.2" }] },
    { dimensionValues: [{ value: "20240701" }, { value: "/blog/ai-seo" },    { value: "ai seo tips" }],      metricValues: [{ value: "30"  }, { value: "800"  }, { value: "0.038" }, { value: "12.5" }] },
    { dimensionValues: [{ value: "20240701" }, { value: "/products" },       { value: "buy widgets" }],      metricValues: [{ value: "20"  }, { value: "600"  }, { value: "0.033" }, { value: "15.0" }] },
    { dimensionValues: [{ value: "20240701" }, { value: "/blog/old-post" },  { value: "legacy guide" }],     metricValues: [{ value: "25"  }, { value: "900"  }, { value: "0.028" }, { value: "18.0" }] },

    // Opwaartse beweging content
    { dimensionValues: [{ value: "20240707" }, { value: "/" },               { value: "brand name" }],       metricValues: [{ value: "130" }, { value: "1050" }, { value: "0.124" }, { value: "3.1" }] },
    { dimensionValues: [{ value: "20240707" }, { value: "/blog/ai-seo" },    { value: "ai seo tips" }],      metricValues: [{ value: "60"  }, { value: "1000" }, { value: "0.060" }, { value: "9.0" }] },
    { dimensionValues: [{ value: "20240707" }, { value: "/products" },       { value: "buy widgets" }],      metricValues: [{ value: "25"  }, { value: "650"  }, { value: "0.038" }, { value: "14.0" }] },
    { dimensionValues: [{ value: "20240707" }, { value: "/" },               { value: "login" }],            metricValues: [{ value: "10"  }, { value: "200"  }, { value: "0.050" }, { value: "2.0" }] },

    // Weekendedip
    { dimensionValues: [{ value: "20240714" }, { value: "/" },               { value: "brand name" }],       metricValues: [{ value: "90"  }, { value: "950"  }, { value: "0.095" }, { value: "3.5" }] },
    { dimensionValues: [{ value: "20240714" }, { value: "/blog/ai-seo" },    { value: "ai seo tips" }],      metricValues: [{ value: "25"  }, { value: "900"  }, { value: "0.028" }, { value: "11.0" }] },
    { dimensionValues: [{ value: "20240714" }, { value: "/products" },       { value: "buy widgets" }],      metricValues: [{ value: "18"  }, { value: "700"  }, { value: "0.026" }, { value: "15.5" }] },
    { dimensionValues: [{ value: "20240714" }, { value: "/sale" },           { value: "summer sale" }],      metricValues: [{ value: "15"  }, { value: "500"  }, { value: "0.030" }, { value: "20.0" }] },

    // Campagne knalt: betere posities & hogere CTR op "summer sale"
    { dimensionValues: [{ value: "20240721" }, { value: "/sale" },           { value: "summer sale" }],      metricValues: [{ value: "150" }, { value: "2000" }, { value: "0.075" }, { value: "5.0" }] },
    { dimensionValues: [{ value: "20240721" }, { value: "/" },               { value: "brand name" }],       metricValues: [{ value: "160" }, { value: "1100" }, { value: "0.145" }, { value: "3.0" }] },
    { dimensionValues: [{ value: "20240721" }, { value: "/blog/ai-seo" },    { value: "ai seo tips" }],      metricValues: [{ value: "70"  }, { value: "1200" }, { value: "0.058" }, { value: "8.5" }] },
    { dimensionValues: [{ value: "20240721" }, { value: "/products" },       { value: "buy widgets" }],      metricValues: [{ value: "30"  }, { value: "800"  }, { value: "0.038" }, { value: "13.0" }] },

    // Afkoeling na campagne
    { dimensionValues: [{ value: "20240728" }, { value: "/sale" },           { value: "summer sale" }],      metricValues: [{ value: "60"  }, { value: "1200" }, { value: "0.050" }, { value: "7.0" }] },
    { dimensionValues: [{ value: "20240728" }, { value: "/" },               { value: "brand name" }],       metricValues: [{ value: "140" }, { value: "1080" }, { value: "0.1296" },{ value: "3.1" }] },
    { dimensionValues: [{ value: "20240728" }, { value: "/blog/ai-seo" },    { value: "ai seo tips" }],      metricValues: [{ value: "55"  }, { value: "1100" }, { value: "0.050" }, { value: "9.0" }] },
    { dimensionValues: [{ value: "20240728" }, { value: "/products" },       { value: "buy widgets" }],      metricValues: [{ value: "28"  }, { value: "780"  }, { value: "0.036" }, { value: "13.5" }] },
    { dimensionValues: [{ value: "20240728" }, { value: "/blog/old-post" },  { value: "legacy guide" }],     metricValues: [{ value: "10"  }, { value: "700"  }, { value: "0.014" }, { value: "20.0" }] }
  ],
  // Totals: som voor clicks/impressions; CTR/position zijn niet lineair optelbaar
  totals: [
    { metricValues: [{ value: "1271" }, { value: "19210" }, { value: "" }, { value: "" }] }
  ]
};
