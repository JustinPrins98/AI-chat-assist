export const ga4ExampleData = {
  dimensionHeaders: [
    { name: "date" },
    { name: "pagePath" }
  ],
  metricHeaders: [
    { name: "screenPageViews" },
    { name: "activeUsers" }
  ],
  rows: [
    // Baseline week
    { dimensionValues: [{ value: "20240701" }, { value: "/" }],              metricValues: [{ value: "180" }, { value: "90" }] },
    { dimensionValues: [{ value: "20240701" }, { value: "/products" }],      metricValues: [{ value: "120" }, { value: "60" }] },
    { dimensionValues: [{ value: "20240701" }, { value: "/blog/ai-seo" }],   metricValues: [{ value: "90"  }, { value: "70" }] },
    { dimensionValues: [{ value: "20240701" }, { value: "/contact" }],       metricValues: [{ value: "30"  }, { value: "20" }] },
    { dimensionValues: [{ value: "20240701" }, { value: "/checkout" }],      metricValues: [{ value: "20"  }, { value: "15" }] },
    { dimensionValues: [{ value: "20240701" }, { value: "/blog/old-post" }], metricValues: [{ value: "40"  }, { value: "35" }] },

    // Opwaartse trend (content deelt beter)
    { dimensionValues: [{ value: "20240707" }, { value: "/" }],              metricValues: [{ value: "220" }, { value: "110" }] },
    { dimensionValues: [{ value: "20240707" }, { value: "/products" }],      metricValues: [{ value: "150" }, { value: "75" }] },
    { dimensionValues: [{ value: "20240707" }, { value: "/blog/ai-seo" }],   metricValues: [{ value: "130" }, { value: "100" }] },
    { dimensionValues: [{ value: "20240707" }, { value: "/contact" }],       metricValues: [{ value: "28"  }, { value: "19" }] },
    { dimensionValues: [{ value: "20240707" }, { value: "/checkout" }],      metricValues: [{ value: "18"  }, { value: "14" }] },
    { dimensionValues: [{ value: "20240707" }, { value: "/blog/old-post" }], metricValues: [{ value: "35"  }, { value: "30" }] },

    // Weekend/dalseizoen dip
    { dimensionValues: [{ value: "20240714" }, { value: "/" }],              metricValues: [{ value: "160" }, { value: "80" }] },
    { dimensionValues: [{ value: "20240714" }, { value: "/products" }],      metricValues: [{ value: "100" }, { value: "50" }] },
    { dimensionValues: [{ value: "20240714" }, { value: "/blog/ai-seo" }],   metricValues: [{ value: "70"  }, { value: "55" }] },
    { dimensionValues: [{ value: "20240714" }, { value: "/contact" }],       metricValues: [{ value: "22"  }, { value: "16" }] },
    { dimensionValues: [{ value: "20240714" }, { value: "/checkout" }],      metricValues: [{ value: "15"  }, { value: "12" }] },
    { dimensionValues: [{ value: "20240714" }, { value: "/blog/old-post" }], metricValues: [{ value: "25"  }, { value: "20" }] },

    // Campagne live: /sale piekt, meer checkout
    { dimensionValues: [{ value: "20240721" }, { value: "/" }],              metricValues: [{ value: "260" }, { value: "130" }] },
    { dimensionValues: [{ value: "20240721" }, { value: "/products" }],      metricValues: [{ value: "140" }, { value: "70" }] },
    { dimensionValues: [{ value: "20240721" }, { value: "/sale" }],          metricValues: [{ value: "300" }, { value: "200" }] },
    { dimensionValues: [{ value: "20240721" }, { value: "/blog/ai-seo" }],   metricValues: [{ value: "120" }, { value: "95" }] },
    { dimensionValues: [{ value: "20240721" }, { value: "/contact" }],       metricValues: [{ value: "35"  }, { value: "25" }] },
    { dimensionValues: [{ value: "20240721" }, { value: "/checkout" }],      metricValues: [{ value: "40"  }, { value: "32" }] },
    { dimensionValues: [{ value: "20240721" }, { value: "/blog/old-post" }], metricValues: [{ value: "20"  }, { value: "18" }] },

    // Na-campagne afkoeling
    { dimensionValues: [{ value: "20240728" }, { value: "/" }],              metricValues: [{ value: "210" }, { value: "105" }] },
    { dimensionValues: [{ value: "20240728" }, { value: "/products" }],      metricValues: [{ value: "130" }, { value: "65" }] },
    { dimensionValues: [{ value: "20240728" }, { value: "/sale" }],          metricValues: [{ value: "120" }, { value: "80" }] },
    { dimensionValues: [{ value: "20240728" }, { value: "/blog/ai-seo" }],   metricValues: [{ value: "100" }, { value: "80" }] },
    { dimensionValues: [{ value: "20240728" }, { value: "/contact" }],       metricValues: [{ value: "32"  }, { value: "22" }] },
    { dimensionValues: [{ value: "20240728" }, { value: "/checkout" }],      metricValues: [{ value: "25"  }, { value: "20" }] },
    { dimensionValues: [{ value: "20240728" }, { value: "/blog/old-post" }], metricValues: [{ value: "18"  }, { value: "15" }] }
  ],
  totals: [
    { metricValues: [{ value: "3003" }, { value: "1828" }] } 
  ]
};