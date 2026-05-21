"use client";

import { useEffect, useState } from "react";

import type { PortfolioResultsMetric } from "./portfolio-results.types";
import cx from "../../utils/cx";
import styles from "../below-the-fold.module.css";

const METRIC_COUNT_DURATION_MS = 1600;
const metricNumberFormatter = new Intl.NumberFormat("en-US");

interface ProofMetricCardProps {
  metric: PortfolioResultsMetric;
  visible: boolean;
  delayMs: number;
}

interface ParsedMetricValue {
  prefix: string;
  target: number;
  suffix: string;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function parseMetricValue(value: string): ParsedMetricValue {
  const match = value.match(/^([^0-9-]*)([\d,]+)(.*)$/);

  if (!match) {
    return { prefix: "", target: 0, suffix: "" };
  }

  return {
    prefix: match[1],
    target: Number(match[2].replaceAll(",", "")),
    suffix: match[3],
  };
}

function formatMetricValue(metric: ParsedMetricValue, value: number) {
  return `${metric.prefix}${metricNumberFormatter.format(Math.round(value))}${
    metric.suffix
  }`;
}

function AnimatedMetricValue({
  value,
  visible,
  delayMs,
}: {
  value: string;
  visible: boolean;
  delayMs: number;
}) {
  const [displayValue, setDisplayValue] = useState(() =>
    formatMetricValue(parseMetricValue(value), 0),
  );

  useEffect(() => {
    const parsed = parseMetricValue(value);
    let animationFrame = 0;
    let startTimer = 0;

    if (!visible) {
      startTimer = window.setTimeout(() => {
        setDisplayValue(formatMetricValue(parsed, 0));
      }, 0);

      return () => {
        window.clearTimeout(startTimer);
      };
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      startTimer = window.setTimeout(() => {
        setDisplayValue(value);
      }, delayMs);

      return () => {
        window.clearTimeout(startTimer);
      };
    }

    startTimer = window.setTimeout(() => {
      const startedAt = performance.now();

      const tick = (now: number) => {
        const progress = clamp(
          (now - startedAt) / METRIC_COUNT_DURATION_MS,
          0,
          1,
        );
        const easedProgress = 1 - Math.pow(1 - progress, 4);

        setDisplayValue(
          formatMetricValue(parsed, parsed.target * easedProgress),
        );

        if (progress < 1) {
          animationFrame = requestAnimationFrame(tick);
          return;
        }

        setDisplayValue(value);
      };

      animationFrame = requestAnimationFrame(tick);
    }, delayMs);

    return () => {
      window.clearTimeout(startTimer);
      cancelAnimationFrame(animationFrame);
    };
  }, [delayMs, value, visible]);

  return (
    <>
      <span aria-hidden="true">{displayValue}</span>
      <span className="sr-only">{value}</span>
    </>
  );
}

export function ProofMetricCard({
  metric,
  visible,
  delayMs,
}: ProofMetricCardProps) {
  return (
    <article
      data-metric-card
      className={cx(
        styles.metricCard,
        "group relative flex min-h-[12.5rem] overflow-hidden rounded-[1.7rem] border bg-white/94 p-5 shadow-[0_20px_55px_rgba(0,0,0,0.07)] backdrop-blur-sm transition-[box-shadow,transform] duration-300 sm:min-h-[13.5rem] sm:p-6 md:min-h-[17rem] md:p-7 2xl:min-h-[19rem] 2xl:p-8 motion-safe:hover:-translate-y-1 motion-safe:hover:shadow-[0_28px_72px_rgba(0,0,0,0.11)]",
        metric.borderClassName,
      )}
    >
      <div
        aria-hidden
        className={cx("absolute inset-x-0 top-0 h-1.5", metric.bandClassName)}
      />
      <div
        aria-hidden
        className={cx(
          "pointer-events-none absolute -right-12 -top-16 h-36 w-36 rounded-full opacity-20 blur-3xl transition-opacity duration-700 group-hover:opacity-30 md:h-44 md:w-44",
          metric.bandClassName,
        )}
      />

      <div className="relative z-10 flex w-full flex-col">
        <div className="flex items-start">
          <span
            className={cx(
              styles.metricCardLabel,
              "rounded-full px-3 py-1.5 font-sans text-[0.72rem] font-semibold uppercase tracking-[0.14em] shadow-[0_10px_24px_rgba(0,0,0,0.08)] sm:text-[0.78rem] md:px-4 md:py-2 md:text-[0.86rem] 2xl:text-[0.98rem]",
              metric.bandClassName,
              metric.labelTextClassName,
            )}
          >
            {metric.label}
          </span>
        </div>

        <div
          className={cx(
            styles.metricCardValueWrap,
            "flex flex-1 items-center justify-center py-6 md:py-8 2xl:py-10",
          )}
        >
          <div
            className={cx(
              styles.metricCardValue,
              "font-sans text-[2.1rem] font-semibold leading-none tracking-tight text-black tabular-nums sm:text-[2.6rem] md:text-[3.2rem] lg:text-[3.4rem] xl:text-[4.4rem] 2xl:text-[5.2rem]",
            )}
          >
            <AnimatedMetricValue
              value={metric.value}
              visible={visible}
              delayMs={delayMs + 160}
            />
          </div>
        </div>

        <p
          className={cx(
            styles.metricCardCopy,
            "border-t border-black/8 pt-4 text-center text-body text-black/70 md:pt-5",
          )}
        >
          {metric.body}
        </p>
      </div>
    </article>
  );
}
