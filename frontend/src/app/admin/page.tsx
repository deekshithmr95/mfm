'use client';

import styles from './admin.module.css';
import { useState, useMemo, useEffect } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAdminStore, AdminUser, UserStatus } from '@/store/useAdminStore';
import { useAboutUsStore } from '@/store/useAboutUsStore';
import { useToastStore } from '@/store/useToastStore';

// =========== USER DETAIL MODAL ===========
function UserDetailModal({
  user,
  onClose,
  onUpdateStatus,
  onUpdateNotes,
}: {
  user: AdminUser;
  onClose: () => void;
  onUpdateStatus: (id: string, status: UserStatus) => void;
  onUpdateNotes: (id: string, notes: string) => void;
}) {
  const [notes, setNotes] = useState(user.notes);
  const [status, setStatus] = useState<UserStatus>(user.status);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    onUpdateStatus(user.id, status);
    onUpdateNotes(user.id, notes);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>User Profile</h2>
          <button className={styles.modalClose} onClick={onClose}>✕</button>
        </div>

        <div className={styles.profileDetail}>
          <div className={styles.profileTop}>
            <div className={styles.profileAvatar}>
              {user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
            </div>
            <div>
              <h3 className={styles.profileName}>{user.name}</h3>
              <p className={styles.profileEmail}>{user.email}</p>
              <p className={styles.profilePhone}>{user.phone}</p>
            </div>
            <span className={`${styles.roleBadge} ${styles[`role_${user.role}`]}`}>{user.role}</span>
          </div>

          {user.role === 'farmer' && (
            <div className={styles.profileMeta}>
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>Farm</span>
                <span className={styles.metaValue}>{user.farm || '—'}</span>
              </div>
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>Location</span>
                <span className={styles.metaValue}>{user.location || '—'}</span>
              </div>
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>Products</span>
                <span className={styles.metaValue}>{user.productCount ?? 0}</span>
              </div>
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>Orders</span>
                <span className={styles.metaValue}>{user.orderCount ?? 0}</span>
              </div>
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>Total Sales</span>
                <span className={styles.metaValue}>₹{(user.totalSales ?? 0).toLocaleString()}</span>
              </div>
            </div>
          )}

          {user.role === 'consumer' && (
            <div className={styles.profileMeta}>
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>Orders</span>
                <span className={styles.metaValue}>{user.orderCount ?? 0}</span>
              </div>
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>Member Since</span>
                <span className={styles.metaValue}>{user.createdAt}</span>
              </div>
            </div>
          )}

          <div className={styles.profileSection}>
            <label className={styles.sectionLabel}>Account Status</label>
            <div className={styles.statusOptions}>
              {(['active', 'suspended', 'pending_onboard'] as const).map((s) => (
                <button key={s}
                  className={`${styles.statusOption} ${status === s ? styles.statusOptionActive : ''} ${styles[`status_${s}`]}`}
                  onClick={() => setStatus(s)}
                >
                  {s === 'active' ? '✅ Active' : s === 'suspended' ? '🚫 Suspended' : '⏳ Pending Onboard'}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.profileSection}>
            <label className={styles.sectionLabel}>Support Notes</label>
            <textarea
              className={styles.notesField}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              placeholder="Add internal notes about this user (visible to admin team only)..."
            />
          </div>
        </div>

        <div className={styles.modalActions}>
          <button className={styles.cancelBtn} onClick={onClose}>Close</button>
          <span className={`${styles.savedMsg} ${saved ? styles.savedMsgVisible : ''}`}>✓ Saved</span>
          <button className={styles.saveBtn} onClick={handleSave}>Save Changes</button>
        </div>
      </div>
    </div>
  );
}

// =========== MAIN ADMIN DASHBOARD ===========
export default function AdminDashboard() {
  const { farmers, consumers, updateUserStatus, updateUserNotes, fetchAllUsers } = useAdminStore();
  const { content: aboutContent, updateContent: updateAboutContent, fetchContent: fetchAboutContent } = useAboutUsStore();
  const addToast = useToastStore((s) => s.addToast);
  const [activeTab, setActiveTab] = useState<'overview' | 'farmers' | 'consumers' | 'about'>('overview');
  const [viewingUser, setViewingUser] = useState<AdminUser | null>(null);
  const [search, setSearch] = useState('');
  const [editAbout, setEditAbout] = useState(aboutContent || {
    heroTitle: '',
    heroSubtitle: '',
    mission: '',
    story: '',
    values: [],
    teamMembers: [],
  });

  useEffect(() => {
    fetchAllUsers();
    fetchAboutContent();
  }, [fetchAllUsers, fetchAboutContent]);

  const allUsers = useMemo(() => [...farmers, ...consumers], [farmers, consumers]);

  const stats = useMemo(() => ({
    totalFarmers: farmers.length,
    totalConsumers: consumers.length,
    totalProducts: farmers.reduce((t, f) => t + (f.productCount || 0), 0),
    totalRevenue: farmers.reduce((t, f) => t + (f.totalSales || 0), 0),
    pendingOnboard: farmers.filter(f => f.status === 'pending_onboard').length,
    suspendedUsers: allUsers.filter(u => u.status === 'suspended').length,
  }), [farmers, consumers, allUsers]);

  const filteredFarmers = useMemo(() =>
    search ? farmers.filter(f => f.name.toLowerCase().includes(search.toLowerCase()) || f.email.toLowerCase().includes(search.toLowerCase())) : farmers
  , [farmers, search]);

  const filteredConsumers = useMemo(() =>
    search ? consumers.filter(c => c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase())) : consumers
  , [consumers, search]);

  const statusBadge = (status: UserStatus) => (
    <span className={`${styles.statusBadge} ${styles[`status_${status}`]}`}>
      {status === 'active' ? 'Active' : status === 'suspended' ? 'Suspended' : 'Pending Onboard'}
    </span>
  );

  return (
    <ProtectedRoute role="admin">
      <div className={styles.page}>
        <div className="container">
          {/* Header */}
          <div className={styles.header}>
            <div>
              <p className={styles.eyebrow}>Admin Panel</p>
              <h1 className={styles.title}>Mysore Farmer Market</h1>
              <p className={styles.subtitle}>Platform management & support</p>
            </div>
          </div>

          {/* Tabs */}
          <div className={styles.tabRow}>
            <div className={styles.tabs}>
              {(['overview', 'farmers', 'consumers', 'about'] as const).map((tab) => (
                <button key={tab}
                  className={`${styles.tab} ${activeTab === tab ? styles.tabActive : ''}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab === 'about' ? 'About Us' : tab.charAt(0).toUpperCase() + tab.slice(1)}
                  {tab === 'farmers' && ` (${farmers.length})`}
                  {tab === 'consumers' && ` (${consumers.length})`}
                </button>
              ))}
            </div>
            {(activeTab === 'farmers' || activeTab === 'consumers') && (
              <input
                className={styles.searchInput}
                placeholder="Search by name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            )}
          </div>

          {/* ===== OVERVIEW ===== */}
          {activeTab === 'overview' && (
            <div className={styles.overview}>
              <div className={styles.statCards}>
                {[
                  { label: 'Farmers', value: stats.totalFarmers.toString(), icon: '🌾', sub: `${stats.pendingOnboard} pending onboard` },
                  { label: 'Consumers', value: stats.totalConsumers.toString(), icon: '🛒', sub: `${stats.suspendedUsers} suspended` },
                  { label: 'Products Listed', value: stats.totalProducts.toString(), icon: '📦', sub: 'across all farmers' },
                  { label: 'Total Revenue', value: `₹${stats.totalRevenue.toLocaleString()}`, icon: '💰', sub: 'platform-wide' },
                ].map((s) => (
                  <div key={s.label} className={styles.statCard}>
                    <span className={styles.statIcon}>{s.icon}</span>
                    <span className={styles.statValue}>{s.value}</span>
                    <span className={styles.statLabel}>{s.label}</span>
                    <span className={styles.statSub}>{s.sub}</span>
                  </div>
                ))}
              </div>

              {/* Pending Onboard Alert */}
              {stats.pendingOnboard > 0 && (
                <div className={styles.alertCard}>
                  <span className={styles.alertIcon}>⏳</span>
                  <div>
                    <h3 className={styles.alertTitle}>{stats.pendingOnboard} farmer{stats.pendingOnboard > 1 ? 's' : ''} pending onboard</h3>
                    <p className={styles.alertDesc}>These farmers need help setting up their profiles and product listings.</p>
                  </div>
                  <button className={styles.alertBtn} onClick={() => setActiveTab('farmers')}>View Farmers →</button>
                </div>
              )}

              {/* Recent Users */}
              <h2 className={styles.sectionTitle}>All Users</h2>
              <div className={styles.userTable}>
                <div className={styles.tableHeader}>
                  <span>Name</span>
                  <span>Email</span>
                  <span>Role</span>
                  <span>Status</span>
                  <span>Joined</span>
                  <span></span>
                </div>
                {allUsers.map((user) => (
                  <div key={user.id} className={styles.tableRow} onClick={() => setViewingUser(user)}>
                    <span className={styles.userName}>
                      <span className={styles.userInitials}>
                        {user.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </span>
                      {user.name}
                    </span>
                    <span className={styles.userEmail}>{user.email}</span>
                    <span><span className={`${styles.roleBadge} ${styles[`role_${user.role}`]}`}>{user.role}</span></span>
                    <span>{statusBadge(user.status)}</span>
                    <span className={styles.dateCell}>{user.createdAt}</span>
                    <span><button className={styles.viewBtn}>View</button></span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ===== FARMERS ===== */}
          {activeTab === 'farmers' && (
            <div className={styles.userTable}>
              <div className={styles.tableHeader}>
                <span>Farmer</span>
                <span>Farm</span>
                <span>Products</span>
                <span>Orders</span>
                <span>Revenue</span>
                <span>Status</span>
                <span></span>
              </div>
              {filteredFarmers.map((farmer) => (
                <div key={farmer.id} className={styles.tableRow} onClick={() => setViewingUser(farmer)}>
                  <span className={styles.userName}>
                    <span className={styles.userInitials}>
                      {farmer.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </span>
                    <span>
                      {farmer.name}
                      <span className={styles.cellSub}>{farmer.email}</span>
                    </span>
                  </span>
                  <span>{farmer.farm}</span>
                  <span>{farmer.productCount}</span>
                  <span>{farmer.orderCount}</span>
                  <span className={styles.revenueCell}>₹{(farmer.totalSales ?? 0).toLocaleString()}</span>
                  <span>{statusBadge(farmer.status)}</span>
                  <span><button className={styles.viewBtn}>View</button></span>
                </div>
              ))}
              {filteredFarmers.length === 0 && (
                <div className={styles.emptyRow}>No farmers found.</div>
              )}
            </div>
          )}

          {/* ===== CONSUMERS ===== */}
          {activeTab === 'consumers' && (
            <div className={styles.userTable}>
              <div className={styles.tableHeader}>
                <span>Consumer</span>
                <span>Email</span>
                <span>Phone</span>
                <span>Orders</span>
                <span>Status</span>
                <span>Joined</span>
                <span></span>
              </div>
              {filteredConsumers.map((consumer) => (
                <div key={consumer.id} className={styles.tableRow} onClick={() => setViewingUser(consumer)}>
                  <span className={styles.userName}>
                    <span className={styles.userInitials}>
                      {consumer.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </span>
                    {consumer.name}
                  </span>
                  <span className={styles.userEmail}>{consumer.email}</span>
                  <span>{consumer.phone}</span>
                  <span>{consumer.orderCount}</span>
                  <span>{statusBadge(consumer.status)}</span>
                  <span className={styles.dateCell}>{consumer.createdAt}</span>
                  <span><button className={styles.viewBtn}>View</button></span>
                </div>
              ))}
              {filteredConsumers.length === 0 && (
                <div className={styles.emptyRow}>No consumers found.</div>
              )}
            </div>
          )}

          {/* ===== ABOUT US MANAGEMENT ===== */}
          {activeTab === 'about' && editAbout && (
            <div className={styles.aboutEditor}>
              <h2 className={styles.sectionTitle}>Manage About Us Page</h2>
              <p className={styles.aboutNote}>Changes made here will update the public About Us page in real-time.</p>

              <div className={styles.aboutForm}>
                <div className={styles.aboutField}>
                  <label>Hero Title</label>
                  <input type="text" value={editAbout.heroTitle || ''} onChange={(e) => setEditAbout({ ...editAbout, heroTitle: e.target.value })} />
                </div>
                <div className={styles.aboutField}>
                  <label>Hero Subtitle</label>
                  <textarea value={editAbout.heroSubtitle} onChange={(e) => setEditAbout({ ...editAbout, heroSubtitle: e.target.value })} rows={2} />
                </div>
                <div className={styles.aboutField}>
                  <label>Mission Statement</label>
                  <textarea value={editAbout.mission} onChange={(e) => setEditAbout({ ...editAbout, mission: e.target.value })} rows={3} />
                </div>
                <div className={styles.aboutField}>
                  <label>Our Story</label>
                  <textarea value={editAbout.story} onChange={(e) => setEditAbout({ ...editAbout, story: e.target.value })} rows={5} />
                </div>

                <h3 className={styles.aboutSubtitle}>Values ({editAbout.values.length})</h3>
                {editAbout.values.map((value, i) => (
                  <div key={i} className={styles.aboutValueRow}>
                    <input type="text" value={value.icon} onChange={(e) => {
                      const updated = [...editAbout.values];
                      updated[i] = { ...updated[i], icon: e.target.value };
                      setEditAbout({ ...editAbout, values: updated });
                    }} style={{ width: 60 }} placeholder="Emoji" />
                    <input type="text" value={value.title} onChange={(e) => {
                      const updated = [...editAbout.values];
                      updated[i] = { ...updated[i], title: e.target.value };
                      setEditAbout({ ...editAbout, values: updated });
                    }} placeholder="Title" />
                    <input type="text" value={value.description} onChange={(e) => {
                      const updated = [...editAbout.values];
                      updated[i] = { ...updated[i], description: e.target.value };
                      setEditAbout({ ...editAbout, values: updated });
                    }} placeholder="Description" style={{ flex: 2 }} />
                  </div>
                ))}

                <h3 className={styles.aboutSubtitle}>Team Members ({editAbout.teamMembers.length})</h3>
                {editAbout.teamMembers.map((member, i) => (
                  <div key={i} className={styles.aboutValueRow}>
                    <input type="text" value={member.name} onChange={(e) => {
                      const updated = [...editAbout.teamMembers];
                      updated[i] = { ...updated[i], name: e.target.value };
                      setEditAbout({ ...editAbout, teamMembers: updated });
                    }} placeholder="Name" />
                    <input type="text" value={member.role} onChange={(e) => {
                      const updated = [...editAbout.teamMembers];
                      updated[i] = { ...updated[i], role: e.target.value };
                      setEditAbout({ ...editAbout, teamMembers: updated });
                    }} placeholder="Role" />
                    <input type="text" value={member.bio} onChange={(e) => {
                      const updated = [...editAbout.teamMembers];
                      updated[i] = { ...updated[i], bio: e.target.value };
                      setEditAbout({ ...editAbout, teamMembers: updated });
                    }} placeholder="Bio" style={{ flex: 2 }} />
                  </div>
                ))}

                <button className={styles.saveBtn} onClick={() => {
                  updateAboutContent(editAbout);
                  addToast('About Us page updated successfully!');
                }}>Save All Changes</button>
              </div>
            </div>
          )}
        </div>

        {/* User Detail Modal */}
        {viewingUser && (
          <UserDetailModal
            user={viewingUser}
            onClose={() => setViewingUser(null)}
            onUpdateStatus={updateUserStatus}
            onUpdateNotes={updateUserNotes}
          />
        )}
      </div>
    </ProtectedRoute>
  );
}
