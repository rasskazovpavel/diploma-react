import { TooltipCodes } from "./TooltipCodes";

export const ChartOptions = (category = "unknown") => {
  return {
    optionsPie: {
      tooltips: {
        enabled: false,
      },
      plugins: {
        legend: {
          labels: {
            color: "#3C4D5F",
          },
        },
        datalabels: {
          formatter: (val, context) =>
            `${
              (Number(val) * 100) /
              context.chart.data.datasets[context.datasetIndex].data.reduce(
                (a, b) => Number(a) + Number(b),
                0
              )
            }%`,
          color: "#fff",
        },
        tooltip: {
          callbacks: {
            title: (xDatapoint) => {
              console.log(xDatapoint);
              if (TooltipCodes[xDatapoint[0].label])
                return TooltipCodes[xDatapoint[0].label];
              return xDatapoint[0].label;
            },
            label: (item) =>
              `${item.label}: ${(
                (item.parsed * 100) /
                item.dataset.data.reduce((a, b) => Number(a) + Number(b), 0)
              ).toFixed(2)}%`,
          },
        },
      },
    },
    optionsBar: {
      plugins: {
        legend: {
          display: false,
          labels: {
            color: "#3C4D5F",
          },
        },
        tooltip: {
          callbacks: {
            title: (xDatapoint) => {
              if (TooltipCodes[xDatapoint[0].label])
                return TooltipCodes[xDatapoint[0].label];
              return xDatapoint[0].label;
            },
            label: (yDatapoint) => {
              return yDatapoint[0];
            },
          },
        },
      },
      scales: {
        x: {
          stacked: true,
          border: {
            color: "#3C4D5F",
          },
          ticks: {
            color: "#3C4D5F",
          },
        },
        y: {
          stacked: true,
          border: {
            color: "#3C4D5F",
          },
          ticks: {
            color: "#3C4D5F",
          },
        },
      },
    },
    optionsBarStacked: {
      plugins: {
        legend: {
          labels: {
            color: "#3C4D5F",
          },
        },
        tooltip: {
          callbacks: {
            title: (xDatapoint) => {
              if (TooltipCodes[xDatapoint[0].label])
                return TooltipCodes[xDatapoint[0].label];
              return xDatapoint[0].label;
            },
            label: (yDatapoint) => {
              if (TooltipCodes[yDatapoint.dataset.label])
                return `${TooltipCodes[yDatapoint.dataset.label]} - ${
                  yDatapoint.formattedValue
                }`;
              return `${yDatapoint.dataset.label} - ${yDatapoint.formattedValue}`;
            },
          },
        },
      },
      scales: {
        x: {
          stacked: true,
          border: {
            color: "#3C4D5F",
          },
          ticks: {
            color: "#3C4D5F",
          },
        },
        y: {
          stacked: true,
          border: {
            color: "#3C4D5F",
          },
          ticks: {
            color: "#3C4D5F",
          },
        },
      },
    },
    optionsLine: {
      plugins: {
        legend: {
          labels: {
            color: "#3C4D5F",
          },
        },
        tooltip: {
          callbacks: {
            title: (xDatapoint) => {
              if (TooltipCodes[xDatapoint[0].label])
                return TooltipCodes[xDatapoint[0].label];
              return xDatapoint[0].label;
            },
          },
        },
      },
      scales: {
        x: {
          border: {
            color: "#3C4D5F",
          },
          ticks: {
            color: "#3C4D5F",
          },
        },
        y: {
          border: {
            color: "#3C4D5F",
          },
          ticks: {
            color: "#3C4D5F",
          },
        },
      },
    },
  };
};
