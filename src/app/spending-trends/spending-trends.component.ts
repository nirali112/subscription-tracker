import { Component, OnInit, OnDestroy } from '@angular/core';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
import { Observable, Subscription } from 'rxjs';
import Chart from 'chart.js/auto';

interface SubscriptionData {
  id?: string;
  service_name: string;
  amount: number;
  subscription_type: string;
  purchase_date: string;
}

@Component({
  selector: 'app-spending-trends',
  standalone: true,
  // imports: [],
  templateUrl: './spending-trends.component.html',
  styleUrls: ['./spending-trends.component.scss']
})
export class SpendingTrendsComponent implements OnInit, OnDestroy {
  subscriptions$: Observable<SubscriptionData[]> | undefined;
  private userSubscription: Subscription | undefined;

  constructor(private firestore: Firestore, private auth: Auth) {}

  ngOnInit() {
    // console.log("🔥 ngOnInit() started...");

    this.auth.onAuthStateChanged(user => {
      if (user) {
        // console.log("✅ User logged in:", user.uid);
        this.loadSubscriptions(user.uid);
      } else {
        console.warn("⚠️ No user logged in!");
      }
    });
  }

  /** Fetch subscriptions from Firestore */
  private loadSubscriptions(userId: string) {
    const subscriptionsCollection = collection(this.firestore, `users/${userId}/subscriptions`);
    this.subscriptions$ = collectionData(subscriptionsCollection, { idField: 'id' }) as Observable<SubscriptionData[]>;

    this.userSubscription = this.subscriptions$.subscribe(subscriptions => {
      // console.log("📊 Subscriptions fetched:", subscriptions);
      this.renderPieChart(subscriptions);
      this.renderBarChart(subscriptions);
      this.renderLineChart(subscriptions);
    });
  }

  /** 🥧 Render Pie Chart (Spending by Service) */
  // private renderPieChart(subscriptions: SubscriptionData[]) {
  //   const ctx = document.getElementById('pieChart') as HTMLCanvasElement;
  //   if (!ctx) return console.error("❌ Pie chart element not found!");

  //   const spendingByService: { [key: string]: number } = {};
  //   subscriptions.forEach(sub => {
  //     spendingByService[sub.service_name] = (spendingByService[sub.service_name] || 0) + sub.amount;
  //   });

  //   const labels = Object.keys(spendingByService);
  //   const data = Object.values(spendingByService);
  //   const colors = this.generateColors(labels.length);

  //   new Chart(ctx, {
  //     type: 'pie',
  //     data: {
  //       labels,
  //       datasets: [{
  //         data,
  //         backgroundColor: colors
  //       }]
  //     }
  //   });
  // }

  private renderPieChart(subscriptions: SubscriptionData[]) {
    const ctx = document.getElementById('pieChart') as HTMLCanvasElement;
    if (!ctx) return console.error("❌ Pie chart element not found!");

    const serviceNames = subscriptions.map(sub => sub.service_name);
    const serviceAmounts = subscriptions.map(sub => sub.amount);
    const serviceColors = serviceNames.map(name => this.getServiceColor(name)); // ✅ Consistent colors

    new Chart(ctx, {
      type: 'pie',
      data: {
        labels: serviceNames,
        datasets: [{
          data: serviceAmounts,
          backgroundColor: serviceColors, // ✅ Uses consistent colors
        }]
      },
      options: {
        responsive: true,
        // maintainAspectRatio: false
      }
    });
  }

  /** 📊 Render Bar Chart (Monthly vs Yearly Spending) */
  private renderBarChart(subscriptions: SubscriptionData[]) {
    const ctx = document.getElementById('barChart') as HTMLCanvasElement;
    if (!ctx) return console.error("❌ Bar chart element not found!");

    let monthlySpending = 0;
    let yearlySpending = 0;

    subscriptions.forEach(sub => {
      if (sub.subscription_type === 'monthly') {
        monthlySpending += sub.amount;
      } else if (sub.subscription_type === 'yearly') {
        yearlySpending += sub.amount;
      }
    });

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Monthly', 'Yearly'],
        datasets: [{
          label: 'Total Spending',
          data: [monthlySpending, yearlySpending],
          backgroundColor: ['#4285F4', '#FBBC05']
        }]
      },
      options: {
        maintainAspectRatio: false, // ✅ Allows custom height
        responsive: true,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }

  /** 📈 Render Line Chart (Spending Over Time) */
  private renderLineChart(subscriptions: SubscriptionData[]) {
    const ctx = document.getElementById('lineChart') as HTMLCanvasElement;
    if (!ctx) return console.error("❌ Line chart element not found!");

    const spendingOverTime: { [date: string]: number } = {};
    subscriptions.forEach(sub => {
      const date = sub.purchase_date;
      spendingOverTime[date] = (spendingOverTime[date] || 0) + sub.amount;
    });

    const labels = Object.keys(spendingOverTime).sort();
    const data = labels.map(date => spendingOverTime[date]);

    new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: 'Spending Over Time',
          data,
          borderColor: '#E91E63',
          backgroundColor: 'rgba(233, 30, 99, 0.2)',
          // fill: true
        }]
      }
    });
  }

  /** 🎨 Generate Random Colors for Charts */
  // private generateColors(count: number): string[] {
  //   return Array.from({ length: count }, () => `hsl(${Math.floor(Math.random() * 360)}, 70%, 60%)`);
  // }

  /** 🎨 Generate consistent colors for services */
private getServiceColor(serviceName: string): string {
  const colorMapping: { [key: string]: string } = {
    'Netflix': '#E50914',
    'Spotify': '#1DB954',
    'Hulu': '#3DBB3D',
    'Amazon Prime': '#146EB4',
    'Disney+': '#113CCF',
    'Gym': '#FF5733',
    'Jio cinema': '#9B59B6',
  };

  // Return a mapped color if available, otherwise generate a new one
  return colorMapping[serviceName] || this.getRandomColor();
}

/** 🎨 Generate a random color if service is not pre-mapped */
private getRandomColor(): string {
  return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
}


  ngOnDestroy() {
    this.userSubscription?.unsubscribe();
  }
}
