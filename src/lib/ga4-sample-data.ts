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
    {
      dimensionValues: [
        { value: "20240701" },
        { value: "/" }
      ],
      metricValues: [
        { value: "180" },
        { value: "90" }
      ]
    },
    {
      dimensionValues: [
        { value: "20240701" },
        { value: "/products" }
      ],
      metricValues: [
        { value: "120" },
        { value: "60" }
      ]
    },
    {
      dimensionValues: [
        { value: "20240701" },
        { value: "/blog" }
      ],
      metricValues: [
        { value: "90" },
        { value: "70" }
      ]
    },
    {
      dimensionValues: [
        { value: "20240701" },
        { value: "/contact" }
      ],
      metricValues: [
        { value: "30" },
        { value: "20" }
      ]
    }
  ],
  totals: [
    {
      metricValues: [
        { value: "420" },
        { value: "240" }
      ]
    }
  ]
};
