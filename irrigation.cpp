#include <iostream>
#include <vector>
#include <algorithm>
#include <cmath>

using namespace std;

typedef long long ll;

struct Point {
    ll x, y;
    int id;
};

Point operator-(const Point& a, const Point& b) { return {a.x - b.x, a.y - b.y, 0}; }
bool operator==(const Point& a, const Point& b) { return a.x == b.x && a.y == b.y; }

ll cross_product(Point a, Point b) { return a.x * b.y - a.y * b.x; }
ll cross_product(Point o, Point a, Point b) { return cross_product(a - o, b - o); }

// Sign of x: -1, 0, 1
int sign(ll x) {
    if (x < 0) return -1;
    if (x > 0) return 1;
    return 0;
}

// Check if segment a-b intersects c-d
bool segments_intersect(Point a, Point b, Point c, Point d) {
    if (max(a.x, b.x) < min(c.x, d.x) || max(c.x, d.x) < min(a.x, b.x) ||
        max(a.y, b.y) < min(c.y, d.y) || max(c.y, d.y) < min(a.y, b.y))
        return false;

    ll cp1 = cross_product(a, b, c);
    ll cp2 = cross_product(a, b, d);
    ll cp3 = cross_product(c, d, a);
    ll cp4 = cross_product(c, d, b);

    if (((cp1 > 0 && cp2 < 0) || (cp1 < 0 && cp2 > 0) || cp1 == 0 || cp2 == 0) &&
        ((cp3 > 0 && cp4 < 0) || (cp3 < 0 && cp4 > 0) || cp3 == 0 || cp4 == 0)) {
            return true;
    }
    return false;
}

// Convex Hull (Monotone Chain)
vector<Point> convex_hull(vector<Point>& pts) {
    int n = pts.size(), k = 0;
    if (n <= 2) return pts;
    vector<Point> h(2 * n);
    sort(pts.begin(), pts.end(), [](Point a, Point b) {
        return a.x < b.x || (a.x == b.x && a.y < b.y);
    });
    for (int i = 0; i < n; ++i) {
        while (k >= 2 && cross_product(h[k - 2], h[k - 1], pts[i]) <= 0) k--;
        h[k++] = pts[i];
    }
    for (int i = n - 2, t = k + 1; i >= 0; i--) {
        while (k >= t && cross_product(h[k - 2], h[k - 1], pts[i]) <= 0) k--;
        h[k++] = pts[i];
    }
    h.resize(k - 1);
    return h;
}

// Check if point p is strictly inside convex polygon poly (or on boundary)
bool is_inside(const vector<Point>& poly, Point p) {
    int n = poly.size();
    if (n == 0) return false;
    if (n == 1) return p == poly[0];
    if (n == 2) {
        return cross_product(poly[0], poly[1], p) == 0 &&
               min(poly[0].x, poly[1].x) <= p.x && p.x <= max(poly[0].x, poly[1].x) &&
               min(poly[0].y, poly[1].y) <= p.y && p.y <= max(poly[0].y, poly[1].y);
    }
    if (cross_product(poly[0], poly[1], p) < 0 || cross_product(poly[0], poly[n-1], p) > 0) return false;

    int l = 1, r = n - 1;
    while (l + 1 < r) {
        int mid = (l + r) / 2;
        if (cross_product(poly[0], poly[mid], p) >= 0) l = mid;
        else r = mid;
    }
    return cross_product(poly[l], poly[r], p) >= 0;
}

// O(log M) intersection of line segment with convex polygon
// If intersection found, sets r1, r2 to indices of edge endpoints and returns true
// Note: finds *one* intersecting edge.
bool intersect_segment_convex_poly_log(Point A, Point B, const vector<Point>& poly, int& r1, int& r2) {
    int n = poly.size();
    if (n < 2) return false;
    if (n == 2) {
        if (segments_intersect(A, B, poly[0], poly[1])) {
            r1 = poly[0].id; r2 = poly[1].id;
            return true;
        }
        return false;
    }

    // Binary search for sign change of CrossProduct(A, B, V_i).
    auto cp = [&](int idx) { return cross_product(A, B, poly[idx]); };

    ll dx = B.x - A.x;
    ll dy = B.y - A.y;
    auto dot = [&](int idx) { return -dy * poly[idx].x + dx * poly[idx].y; };

    // Robust Hill Climbing for Extreme Point
    auto hill_climb_extreme = [&](bool maximize) {
        int best = 0;
        ll best_val = dot(0);
        // Check a few widely spaced points to find a good starting candidate
        int step = max(1, n / 20);
        for (int i = 0; i < n; i += step) {
            ll v = dot(i);
            if (maximize ? (v > best_val) : (v < best_val)) {
                best_val = v;
                best = i;
            }
        }

        // Hill climb
        int curr = best;
        for (int iter = 0; iter < n; ++iter) { // Safety bound
            int next = (curr + 1) % n;
            int prev = (curr - 1 + n) % n;
            ll val_curr = dot(curr);
            ll val_next = dot(next);
            ll val_prev = dot(prev);

            if (maximize) {
                if (val_next > val_curr) curr = next;
                else if (val_prev > val_curr) curr = prev;
                else return curr; // Local max is global max
            } else {
                if (val_next < val_curr) curr = next;
                else if (val_prev < val_curr) curr = prev;
                else return curr; // Local min is global min
            }
        }
        return curr;
    };

    int max_idx = hill_climb_extreme(true);
    int min_idx = hill_climb_extreme(false);

    // Check signs
    ll cp_max = cp(max_idx);
    ll cp_min = cp(min_idx);

    // If both have same sign (and non-zero), no intersection
    if (cp_max > 0 && cp_min > 0) return false;
    if (cp_max < 0 && cp_min < 0) return false;

    // There is an intersection (or touch).
    // We need to find the edge.
    // The transition is between max_idx and min_idx (in one of the two chains).
    // Check both chains.

    auto check_chain = [&](int start, int end) {
        // start to end cyclic
        // binary search for sign change
        // We know sign(start) != sign(end) (or one is 0)

        if (cp(start) == 0) {
            // Vertex start is on line.
            // Check edges incident to start.
            // (start, next)
            int next = (start + 1) % n;
            if (segments_intersect(A, B, poly[start], poly[next])) {
                r1 = poly[start].id; r2 = poly[next].id;
                return true;
            }
            int prev = (start - 1 + n) % n;
            if (segments_intersect(A, B, poly[prev], poly[start])) {
                r1 = poly[prev].id; r2 = poly[start].id;
                return true;
            }
            return false;
        }

        // If non-zero signs, perform binary search
        // Length of chain
        int len = (end - start + n) % n;
        int L = 0, R = len;

        // Check cp(end)
        if (sign(cp(start)) == sign(cp(end))) return false;

        while (L + 1 < R) {
            int mid = (L + R) / 2;
            int idx = (start + mid) % n;
            if (sign(cp(idx)) == sign(cp(start))) L = mid;
            else R = mid;
        }
        // Transition between start+L and start+R (which is start+L+1)
        int idx1 = (start + L) % n;
        int idx2 = (start + L + 1) % n;
        if (segments_intersect(A, B, poly[idx1], poly[idx2])) {
            r1 = poly[idx1].id; r2 = poly[idx2].id;
            return true;
        }
        return false;
    };

    if (check_chain(max_idx, min_idx)) return true;
    if (check_chain(min_idx, max_idx)) return true;

    return false;
}

void solve() {
    int n;
    if (!(cin >> n)) return;
    vector<Point> P(n);
    for (int i = 0; i < n; ++i) {
        cin >> P[i].x >> P[i].y;
        P[i].id = i + 1;
    }
    int m;
    cin >> m;
    vector<Point> R(m);
    for (int i = 0; i < m; ++i) {
        cin >> R[i].x >> R[i].y;
        R[i].id = i + 1;
    }

    vector<Point> HP = convex_hull(P);
    vector<Point> HR = convex_hull(R);

    // Heuristic + Optimization
    try {
        auto run_h = [&](vector<Point> P_pts, vector<Point> R_hull, bool p_is_pump) {
             double cx = 0, cy = 0;
             for (auto& p : R_hull) { cx += p.x; cy += p.y; }
             cx /= R_hull.size();
             cy /= R_hull.size();

             sort(P_pts.begin(), P_pts.end(), [&](Point a, Point b) {
                 return atan2(a.y - cy, a.x - cx) < atan2(b.y - cy, b.x - cx);
             });

             int n_p = P_pts.size();
             vector<int> offsets;
             for(int k=1; k<=10; ++k) offsets.push_back(k);
             for(int k=0; k<=5; ++k) offsets.push_back(n_p/2 - k);
             for(int k=1; k<=5; ++k) offsets.push_back(n_p/2 + k);
             for(int k=0; k<10; ++k) offsets.push_back(rand() % n_p);

             for (int i = 0; i < n_p; ++i) {
                for (int k : offsets) {
                    int j = (i + k) % n_p;
                    if (j < 0) j += n_p;
                    if (i == j) continue;
                    Point A = P_pts[i];
                    Point B = P_pts[j];

                    int r1, r2;
                    if (intersect_segment_convex_poly_log(A, B, R_hull, r1, r2)) {
                        if (p_is_pump) cout << A.id << " " << B.id << " " << r1 << " " << r2 << "\n";
                        else cout << r1 << " " << r2 << " " << A.id << " " << B.id << "\n";
                        throw 1;
                    }
                }
             }
        };

        run_h(P, HR, true);
        run_h(R, HP, false);

        // Fallback for nested cases (e.g. strict inclusion not caught by heuristic)
        // Check P in HR
        for (const auto& p : P) {
            if (is_inside(HR, p)) {
                // p is inside. Connect to any point outside (e.g. vertices of HP).
                for (const auto& q : HP) {
                    if (!is_inside(HR, q)) {
                        int r1, r2;
                        if(intersect_segment_convex_poly_log(p, q, HR, r1, r2)) {
                            cout << p.id << " " << q.id << " " << r1 << " " << r2 << "\n";
                            throw 1;
                        }
                    }
                }
                break;
            }
        }

        // Check R in HP
        for (const auto& r : R) {
             if (is_inside(HP, r)) {
                 // r is inside HP. If we didn't find anything with run_h(P, HR), and R is in HP...
                 // maybe R is "hidden" in a small triangle of P?
                 // But run_h covers P-segments near centroid of R.
                 // If R is tiny, run_h finds "stabbing" P-segments.
                 break;
             }
        }

    } catch (int) {
        return;
    }

    cout << "-1\n";
}

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    int t;
    if (cin >> t) {
        while (t--) {
            solve();
        }
    }
    return 0;
}
