import { Component, OnInit, ViewChild, ElementRef, inject } from '@angular/core';
import Chart from 'chart.js/auto';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
import { Observable } from 'rxjs';

interface Subscription {
  service_name: string;
  amount: number;
}

@Component({
  selector: 'app-spending-trends',
  standalone: true,
  templateUrl: './spending-trends.component.html',
  styleUrls: ['./spending-trends.component.scss']
})
export class SpendingTrendsComponent implements OnInit {
  @ViewChild('spendingChart', { static: true }) spendingChart!: ElementRef;
  private firestore: Firestore = inject(Firestore);
  private auth: Auth = inject(Auth);
  subscriptions$: Observable<Subscription[]> | undefined;

  ngOnInit() {
    this.auth.onAuthStateChanged((user) => {
      if (user) {
        this.loadSubscriptionData(user.uid);
      } else {
        console.error("User not authenticated");
      }
    });
  }

  loadSubscriptionData(userId: string) {
    const subscriptionsCollection = collection(this.firestore, `users/${userId}/subscriptions`);
    this.subscriptions$ = collectionData(subscriptionsCollection, { idField: 'id' }) as Observable<Subscription[]>;

    this.subscriptions$.subscribe((subscriptions) => {
      this.renderChart(subscriptions);
    });
  }

  renderChart(subscriptions: Subscription[]) {
    if (!this.spendingChart.nativeElement) {
      console.error('Chart element not found');
      return;
    }

    const categories = subscriptions.map(s => s.service_name);
    const amounts = subscriptions.map(s => s.amount);

    new Chart(this.spendingChart.nativeElement, {
      type: 'bar',
      data: {
        labels: categories,
        datasets: [{
          label: 'Spending in USD',
          data: amounts,
          backgroundColor: ['#007bff', '#28a745', '#ffc107', '#dc3545', '#17a2b8']
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: true }
        }
      }
    });
  }
}
