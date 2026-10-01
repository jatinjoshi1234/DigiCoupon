"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Customer, getCustomers } from "./services/customer.service";

import { logout } from "./services/auth.service";
import { useRouter } from "next/navigation";
import { DashboardData, getDashboard } from "./services/dashboard.service";

export default function Home() {
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    loadDashboard();
  }, []);
  async function loadDashboard() {
    try {
      setLoading(true);
      setError("");
      const data = await getDashboard();
      console.log("page => response => ", data);
      data.recentRedemptions = JSON.parse(data.recentRedemptionsJson);
      setDashboard(data);
    } catch (error) {
      console.error("Dashboard API error:", error);
      setError(
        error instanceof Error ? error.message : "Unable to load dashboard.",
      );
    } finally {
      setLoading(false);
    }
  }
  if (loading) {
    return (
      <div className="dashboard-page">
        {" "}
        <div className="dashboard-loading">
          {" "}
          <div className="dashboard-spinner"></div>{" "}
          <span>Loading dashboard...</span>{" "}
        </div>{" "}
      </div>
    );
  }
  if (error) {
    return (
      <div className="dashboard-page">
        {" "}
        <div className="dashboard-error">
          {" "}
          <div className="dashboard-error-icon">!</div>{" "}
          <h3>Unable to load dashboard</h3> <p>{error}</p>{" "}
          <button onClick={loadDashboard}> Try Again </button>{" "}
        </div>{" "}
      </div>
    );
  }
  if (!dashboard) {
    return null;
  }
  return (
    <div className="dashboard-page">
      {" "}
      {/* Welcome Header */}{" "}
      <div className="dashboard-welcome">
        {" "}
        <div>
          {" "}
          <div className="dashboard-eyebrow"> RESTAURANT DASHBOARD </div>{" "}
          <h1> Good morning, {dashboard.ownerName} 👋 </h1>{" "}
          <p>
            {" "}
            Here's what's happening at{" "}
            <strong>{dashboard.restaurantName}</strong> today.{" "}
          </p>{" "}
        </div>{" "}
        <button className="dashboard-refresh-button" onClick={loadDashboard}>
          {" "}
          ↻ Refresh{" "}
        </button>{" "}
      </div>{" "}
      {/* Statistics */}{" "}
      <div className="dashboard-stats">
        {" "}
        <div className="dashboard-stat-card">
          {" "}
          <div className="stat-top">
            {" "}
            <div className="stat-icon customers-icon"> 👥 </div>{" "}
            <span className="stat-label"> CUSTOMERS </span>{" "}
          </div>{" "}
          <div className="stat-value"> {dashboard.totalCustomers} </div>{" "}
          <div className="stat-description">
            {" "}
            Total registered customers{" "}
          </div>{" "}
        </div>{" "}
        <div className="dashboard-stat-card">
          {" "}
          <div className="stat-top">
            {" "}
            <div className="stat-icon passes-icon"> 🎫 </div>{" "}
            <span className="stat-label"> ACTIVE PASSES </span>{" "}
          </div>{" "}
          <div className="stat-value"> {dashboard.activePasses} </div>{" "}
          <div className="stat-description"> Currently active passes </div>{" "}
        </div>{" "}
        <div className="dashboard-stat-card">
          {" "}
          <div className="stat-top">
            {" "}
            <div className="stat-icon redemption-icon"> ✓ </div>{" "}
            <span className="stat-label"> TOTAL REDEMPTIONS </span>{" "}
          </div>{" "}
          <div className="stat-value"> {dashboard.totalRedemptions} </div>{" "}
          <div className="stat-description">
            {" "}
            All-time pass redemptions{" "}
          </div>{" "}
        </div>{" "}
        <div className="dashboard-stat-card today-card">
          {" "}
          <div className="stat-top">
            {" "}
            <div className="stat-icon today-icon"> ⚡ </div>{" "}
            <span className="stat-label"> TODAY </span>{" "}
          </div>{" "}
          <div className="stat-value"> {dashboard.todayRedemptions} </div>{" "}
          <div className="stat-description"> Redemptions today </div>{" "}
        </div>{" "}
      </div>{" "}
      {/* Main Content */}{" "}
      <div className="dashboard-grid">
        {" "}
        {/* Recent Redemptions */}{" "}
        <div className="dashboard-panel recent-panel">
          {" "}
          <div className="panel-header">
            {" "}
            <div>
              {" "}
              <h2>Recent Redemptions</h2>{" "}
              <p>Latest customer pass activity</p>{" "}
            </div>{" "}
            <a href="/redemption"> View all → </a>{" "}
          </div>{" "}
          {dashboard.recentRedemptions.length === 0 ? (
            <div className="dashboard-empty">
              {" "}
              <div className="empty-icon"> 🎫 </div> <h3>No redemptions yet</h3>{" "}
              <p> Customer redemptions will appear here. </p>{" "}
            </div>
          ) : (
            <div className="redemption-list">
              {" "}
              {dashboard.recentRedemptions.slice(0, 5).map((item, index) => (
                <div
                  className="redemption-item"
                  key={`${item.couponNumber}-${index}`}
                >
                  {" "}
                  <div className="customer-avatar">
                    {" "}
                    {item.customer?.charAt(0)?.toUpperCase()}{" "}
                  </div>{" "}
                  <div className="customer-info">
                    {" "}
                    <strong> {item.customer} </strong>{" "}
                    <span> {item.mobile} </span>{" "}
                  </div>{" "}
                  <div className="redemption-coupon">
                    {" "}
                    <span>Pass</span>{" "}
                    <strong> {item.couponNumber} </strong>{" "}
                  </div>{" "}
                  <div className="redemption-date">
                    {" "}
                    {new Date(item.redemptionOn).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                    })}{" "}
                  </div>{" "}
                  <div className="redemption-status"> ✓ </div>{" "}
                </div>
              ))}{" "}
            </div>
          )}{" "}
        </div>{" "}
        {/* Right Side */}{" "}
        <div className="dashboard-side">
          {" "}
          {/* Quick Actions */}{" "}
          <div className="dashboard-panel quick-panel">
            {" "}
            <div className="panel-header">
              {" "}
              <div>
                {" "}
                <h2>Quick Actions</h2> <p>Common restaurant tasks</p>{" "}
              </div>{" "}
            </div>{" "}
            <div className="quick-actions">
              {" "}
              <a href="/customers/create" className="quick-action">
                {" "}
                <span className="quick-action-icon"> + </span>{" "}
                <span>
                  {" "}
                  <strong>Add Customer</strong>{" "}
                  <small>Register a new customer</small>{" "}
                </span>{" "}
                <span className="quick-arrow"> → </span>{" "}
              </a>{" "}
              <a href="/passes/create" className="quick-action">
                {" "}
                <span className="quick-action-icon"> 🎫 </span>{" "}
                <span>
                  {" "}
                  <strong>Create Pass</strong>{" "}
                  <small>Create a customer pass</small>{" "}
                </span>{" "}
                <span className="quick-arrow"> → </span>{" "}
              </a>{" "}
              <a href="/redemption" className="quick-action highlight-action">
                {" "}
                <span className="quick-action-icon"> ✓ </span>{" "}
                <span>
                  {" "}
                  <strong>Redeem Pass</strong>{" "}
                  <small>Redeem customer pass</small>{" "}
                </span>{" "}
                <span className="quick-arrow"> → </span>{" "}
              </a>{" "}
            </div>{" "}
          </div>{" "}
          {/* Expiring Passes */}{" "}
          <div className="dashboard-panel expiring-panel">
            {" "}
            <div className="panel-header">
              {" "}
              <div>
                {" "}
                <h2>Passes Expiring Soon</h2>{" "}
                <p>Keep an eye on upcoming expirations</p>{" "}
              </div>{" "}
            </div>{" "}
            <div className="expiring-content">
              {" "}
              <div className="expiring-number">
                {" "}
                {dashboard.expiringPasses}{" "}
              </div>{" "}
              <div className="expiring-text">
                {" "}
                <strong>passes</strong>{" "}
                <span> are approaching their expiry date </span>{" "}
              </div>{" "}
            </div>{" "}
            {dashboard.expiringPasses > 0 && (
              <a href="/passes?filter=expiring" className="expiring-link">
                {" "}
                View expiring passes →{" "}
              </a>
            )}{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
    </div>
  );
}
