import { useState, useEffect } from 'react';
import { friendService } from '../services/article.service';

export default function Amis() {
  const [friends, setFriends]           = useState([]);
  const [pending, setPending]           = useState([]);
  const [search, setSearch]             = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [searchError, setSearchError]   = useState('');
  const [loading, setLoading]           = useState(true);
  const [activeTab, setActiveTab]       = useState('liste');

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [friendsData, pendingData] = await Promise.all([
        friendService.getAll(),
        friendService.getPending(),
      ]);
      setFriends(friendsData.friends || []);
      setPending(pendingData.pending || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setSearchError('');
    setSearchResult(null);
    try {
      const data = await friendService.search(search.trim());
      setSearchResult(data.user);
    } catch (err) {
      setSearchError(err.message);
    }
  };

  const handleSendRequest  = async (username) => {
    try {
      await friendService.sendRequest(username);
      alert('Demande envoyée !');
      setSearchResult(null);
      setSearch('');
    } catch (err) { alert(err.message); }
  };

  const handleAccept  = async (id) => { await friendService.accept(id);  fetchData(); };
  const handleReject  = async (id) => { await friendService.reject(id);  fetchData(); };
  const handleRemove  = async (id) => { if (!window.confirm('Supprimer ?')) return; await friendService.remove(id);  fetchData(); };
  const handleBlock   = async (id) => { if (!window.confirm('Bloquer ?'))   return; await friendService.block(id);   fetchData(); };
  const handleUnblock = async (id) => { if (!window.confirm('Débloquer ?')) return; await friendService.unblock(id); fetchData(); };

  const tabs = [
    { key: 'liste',     label: 'Mes amis' },
    { key: 'demandes',  label: `Demandes${pending.length > 0 ? ` (${pending.length})` : ''}` },
    { key: 'recherche', label: 'Ajouter un ami' },
  ];

  return (
    <div className="container py-4">

      {/* Header */}
      <div className="dashboard-header">
        <div>
          <h2>Mes amis</h2>
          <p>{friends.filter(f => f.status !== 'blocked').length} ami(s) · {friends.filter(f => f.status === 'blocked').length} bloqué(s)</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs-custom">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            className={`tab-btn ${activeTab === tab.key ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border spinner-rouge" />
        </div>
      ) : (
        <>
          {/* ── Liste des amis ── */}
          {activeTab === 'liste' && (
            friends.length === 0 ? (
              <div className="empty-state">
                <p>Vous n'avez pas encore d'amis.</p>
                <button className="btn-rouge" onClick={() => setActiveTab('recherche')}>
                  Trouver des amis
                </button>
              </div>
            ) : (
              <div className="row g-3">
                {friends.map((friend) => (
                  <div key={friend.friendship_id} className="col-md-6 col-lg-4">
                    <div className="card-custom" style={{ padding: '1rem 1.2rem', opacity: friend.status === 'blocked' ? 0.6 : 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>

                        {/* Avatar */}
                        <div className={`avatar ${friend.status === 'blocked' ? 'avatar-grey' : ''}`}>
                          {friend.username[0].toUpperCase()}
                        </div>

                        {/* Infos */}
                        <div style={{ flex: 1, overflow: 'hidden' }}>
                          <div style={{ fontWeight: 600, fontSize: '0.92rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {friend.nom_complet}
                          </div>
                          <div style={{ color: 'var(--texte-muted)', fontSize: '0.8rem' }}>
                            @{friend.username}
                          </div>
                          {friend.status === 'blocked' && (
                            <span className="badge-bloque" style={{ marginTop: '0.3rem', display: 'inline-block' }}>
                              Bloqué
                            </span>
                          )}
                        </div>

                        {/* Menu */}
                        <div className="dropdown">
                          <button
                            style={{
                              background: 'none',
                              border: '1px solid var(--gris-bord)',
                              borderRadius: '4px',
                              padding: '0.2rem 0.6rem',
                              cursor: 'pointer',
                              fontSize: '1rem',
                              color: 'var(--texte-muted)',
                            }}
                            data-bs-toggle="dropdown"
                          >
                            ⋯
                          </button>
                          <ul className="dropdown-menu dropdown-menu-end" style={{ fontSize: '0.88rem' }}>
                            {friend.status === 'blocked' ? (
                              <li>
                                <button className="dropdown-item text-success" onClick={() => handleUnblock(friend.friendship_id)}>
                                  Débloquer
                                </button>
                              </li>
                            ) : (
                              <>
                                <li>
                                  <button className="dropdown-item text-danger" onClick={() => handleRemove(friend.friendship_id)}>
                                    Supprimer
                                  </button>
                                </li>
                                <li>
                                  <button className="dropdown-item text-warning" onClick={() => handleBlock(friend.friendship_id)}>
                                    Bloquer
                                  </button>
                                </li>
                              </>
                            )}
                          </ul>
                        </div>

                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )
          )}

          {/* ── Demandes reçues ── */}
          {activeTab === 'demandes' && (
            pending.length === 0 ? (
              <div className="empty-state">
                <p>Aucune demande en attente.</p>
              </div>
            ) : (
              <div className="row g-3">
                {pending.map((req) => (
                  <div key={req.friendship_id} className="col-md-6">
                    <div className="card-custom" style={{ padding: '1rem 1.2rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                        <div className="avatar avatar-grey">
                          {req.username[0].toUpperCase()}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 600, fontSize: '0.92rem' }}>{req.nom_complet}</div>
                          <div style={{ color: 'var(--texte-muted)', fontSize: '0.8rem' }}>@{req.username}</div>
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button
                            className="btn-rouge"
                            style={{ padding: '0.35rem 0.8rem', fontSize: '0.82rem' }}
                            onClick={() => handleAccept(req.friendship_id)}
                          >
                            Accepter
                          </button>
                          <button
                            className="btn-outline-rouge"
                            style={{ padding: '0.35rem 0.8rem', fontSize: '0.82rem' }}
                            onClick={() => handleReject(req.friendship_id)}
                          >
                            Refuser
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )
          )}

          {/* ── Recherche ── */}
          {activeTab === 'recherche' && (
            <div style={{ maxWidth: 500, margin: '0 auto' }}>
              <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.6rem', marginBottom: '1.2rem' }}>
                <input
                  type="text"
                  className="form-control-custom"
                  placeholder="Rechercher par username..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  required
                  style={{ flex: 1 }}
                />
                <button type="submit" className="btn-rouge" style={{ padding: '0.6rem 1.2rem' }}>
                  Chercher
                </button>
              </form>

              {searchError && (
                <div className="alert-custom mb-3">{searchError}</div>
              )}

              {searchResult && (
                <div className="card-custom" style={{ padding: '1rem 1.2rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                    <div className="avatar">
                      {searchResult.username[0].toUpperCase()}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: '0.92rem' }}>{searchResult.nom_complet}</div>
                      <div style={{ color: 'var(--texte-muted)', fontSize: '0.8rem' }}>@{searchResult.username}</div>
                    </div>
                    <button
                      className="btn-rouge"
                      style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }}
                      onClick={() => handleSendRequest(searchResult.username)}
                    >
                      Ajouter
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

        </>
      )}
    </div>
  );
}