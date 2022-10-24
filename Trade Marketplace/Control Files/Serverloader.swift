
import SwiftUI
import Firebase
import FirebaseDatabase
import FirebaseAuth

/// Download all profile data and store data
class downloadprofileviewdata: ObservableObject {
    @Published  var firstname: String = ""
    @Published  var lastname: String = ""
    @Published  var location: String = ""
    @Published  var username: String = ""
    @Published  var reviews: Int = 0
    init() {
        DownloadProfileViewData()
    }
    
    let db = Firestore.firestore()
    let user = Auth.auth().currentUser
    func DownloadProfileViewData() { // << async, no immediate return
        //        let uid = Auth.auth().currentUser?.uid
        db.collection("users").document(self.user!.uid).collection("Profile").getDocuments() { (querySnapshot, err) in
            if let err = err {
                print("Error getting documents: \(err)")
            } else {
                for document in querySnapshot!.documents {
                    print("\(document.documentID) => \(document.data())")
                    let mydata = document.data()
                    let firstname = mydata["firstname"] as? String ?? ""
                    let lastname = mydata["lastname"] as? String ?? ""
                    let location = mydata["location"] as? String ?? ""
                    let username = mydata["username"] as? String ?? ""
                    let reviews = mydata["reviews"] as? Int ?? 0
                    
                    DispatchQueue.main.async {
                        self.firstname = firstname // << store result
                        self.lastname = lastname // << store result
                        self.location = location // << store result
                        self.reviews = reviews // << store result
                        self.username = username // << store result
                    }
                }
            }
        }
    }
}

/// Download all completed listing data
class downloadcompletedlistingsdata: ObservableObject{
    @Published var output: [downloadcompleteddatastruct] = []
    @Published var count: NSNumber = 0
    
    let db = Firestore.firestore()
    let user = Auth.auth().currentUser
    
    func getData() {
        output.removeAll()
        print(self.user!.uid)
        db.collection("users").document(self.user!.uid).collection("CompletedListings").getDocuments() { (querySnapshot, err) in
            if let err = err {
                print("Error getting documents: \(err)")
            } else {
                for document in querySnapshot!.documents {
                    print("\(document.documentID) => \(document.data())")
                    let data = document.data()
                    
                    let id = document.documentID
                    let category = data["category"] as? String ?? ""
                    let title = data["title"] as? String ?? ""
                    let subtitle = data["subtitle"] as? String ?? ""
                    let quotesent = data["quotesent"] as? Int ?? 0
                    let location = data["location"] as? String ?? ""
                    let description = data["description"] as? String ?? ""
                    let images = data["images"] as? String ?? ""
                    let bot = data["bot"] as? Bool ?? false
                    
                    let a = downloadcompleteddatastruct(id: id, category: category, title: title, subtitle: subtitle, quotesent: quotesent, location: location, description: description, images: images, bot: bot)
                    self.output.append(a)
                    
                }
            }
            
        }
        
    }
}

/// Store all completed listing data
struct downloadcompleteddatastruct: Identifiable  {
    var id: String
    var category: String
    var title: String
    var subtitle: String
    var quotesent: Int
    var location: String
    var description: String
    var images: String
    var bot: Bool
}

/// Download all listing data
class downloadlistingsdata: ObservableObject{
    @Published var output: [downloadlistingdatastruct] = []
    @Published var count: NSNumber = 0
    
    let db = Firestore.firestore()
    let user = Auth.auth().currentUser
    
    func getData() {
        output.removeAll()
        print(self.user!.uid)
        db.collection("users").document(self.user!.uid).collection("Listings").getDocuments() { (querySnapshot, err) in
            if let err = err {
                print("Error getting documents: \(err)")
            } else {
                for document in querySnapshot!.documents {
                    print("\(document.documentID) => \(document.data())")
                    let data = document.data()
                    
                    let id = document.documentID
                    let category = data["category"] as? String ?? ""
                    let title = data["title"] as? String ?? ""
                    let subtitle = data["subtitle"] as? String ?? ""
                    let quotesent = data["quotesent"] as? Int ?? 0
                    let location = data["location"] as? String ?? ""
                    let description = data["description"] as? String ?? ""
                    let images = data["images"] as? String ?? ""
                    let bot = data["bot"] as? Bool ?? false
                    
                    let a = downloadlistingdatastruct(id: id, category: category, title: title, subtitle: subtitle, quotesent: quotesent, location: location, description: description, images: images, bot: bot)
                    self.output.append(a)
                    
                }
            }
            
        }
        
    }
}

/// Store all listing data
struct downloadlistingdatastruct: Identifiable  {
    var id: String
    var category: String
    var title: String
    var subtitle: String
    var quotesent: Int
    var location: String
    var description: String
    var images: String
    var bot: Bool
}

/// Download all recievedquotes data
class downloadrecievedquotesdata: ObservableObject{
    @Published var output: [downloadrecievedquotesstruct] = []
    @Published var count: NSNumber = 0
    
    let db = Firestore.firestore()
    let user = Auth.auth().currentUser
    
    func getData() {
        output.removeAll()
        print(self.user!.uid)
        db.collection("users").document(self.user!.uid).collection("RecievedQuotes").getDocuments() { (querySnapshot, err) in
            if let err = err {
                print("Error getting documents: \(err)")
            } else {
                for document in querySnapshot!.documents {
                    print("\(document.documentID) => \(document.data())")
                    let data = document.data()
                    
                    let id = document.documentID
                    let category = data["category"] as? String ?? ""
                    let title = data["title"] as? String ?? ""
                    let subtitle = data["subtitle"] as? String ?? ""
                    let quotesent = data["quotesent"] as? Int ?? 0
                    let location = data["location"] as? String ?? ""
                    let description = data["description"] as? String ?? ""
                    let images = data["images"] as? String ?? ""
                    let bot = data["bot"] as? Bool ?? false
                    
                    let a = downloadrecievedquotesstruct(id: id, category: category, title: title, subtitle: subtitle, quotesent: quotesent, location: location, description: description, images: images, bot: bot)
                    self.output.append(a)
                    
                }
            }
            
        }
        
    }
}

/// Store all recievedquotes data
struct downloadrecievedquotesstruct: Identifiable  {
    var id: String
    var category: String
    var title: String
    var subtitle: String
    var quotesent: Int
    var location: String
    var description: String
    var images: String
    var bot: Bool
}

/// Download all SentQuotes data
class downloadSentQuotes: ObservableObject {
        @Published var output: [downloadsentquotesdatastruct] = []
        @Published var count: NSNumber = 0
        
        let db = Firestore.firestore()
        let user = Auth.auth().currentUser
        
        func getData() {
            output.removeAll()
            print(self.user!.uid)
            db.collection("users").document(self.user!.uid).collection("SentQuotes").getDocuments() { (querySnapshot, err) in
                if let err = err {
                    print("Error getting documents: \(err)")
                } else {
                    for document in querySnapshot!.documents {
                        print("\(document.documentID) => \(document.data())")
                        let data = document.data()
                        
                        let id = document.documentID
                        let category = data["category"] as? String ?? ""
                        let title = data["title"] as? String ?? ""
                        let subtitle = data["subtitle"] as? String ?? ""
                        let quotesent = data["quotesent"] as? Int ?? 0
                        let location = data["location"] as? String ?? ""
                        let description = data["description"] as? String ?? ""
                        let images = data["images"] as? String ?? ""
                        let bot = data["bot"] as? Bool ?? false
                        
                        let a = downloadsentquotesdatastruct(id: id, category: category, title: title, subtitle: subtitle, quotesent: quotesent, location: location, description: description, images: images, bot: bot)
                        self.output.append(a)
                        
                    }
                }
                
            }
            
        }
    }

/// Store all SentQuotes data
struct downloadsentquotesdatastruct: Identifiable  {
    var id: String
    var category: String
    var title: String
    var subtitle: String
    var quotesent: Int
    var location: String
    var description: String
    var images: String
    var bot: Bool
}

/// Download all Watchlist data
class downloadWatchlist: ObservableObject {
    @Published var output: [downloadwatchlistdatastruct] = []
    @Published var count: NSNumber = 0
    
    let db = Firestore.firestore()
    let user = Auth.auth().currentUser
    
    func getData() {
        output.removeAll()
        print(self.user!.uid)
        db.collection("users").document(self.user!.uid).collection("Watchlist").getDocuments() { (querySnapshot, err) in
            if let err = err {
                print("Error getting documents: \(err)")
            } else {
                for document in querySnapshot!.documents {
                    print("\(document.documentID) => \(document.data())")
                    let data = document.data()
                    
                    let id = document.documentID
                    let category = data["category"] as? String ?? ""
                    let title = data["title"] as? String ?? ""
                    let subtitle = data["subtitle"] as? String ?? ""
                    let quotesent = data["quotesent"] as? Int ?? 0
                    let location = data["location"] as? String ?? ""
                    let description = data["description"] as? String ?? ""
                    let images = data["images"] as? String ?? ""
                    let bot = data["bot"] as? Bool ?? false
                    
                    let a = downloadwatchlistdatastruct(id: id, category: category, title: title, subtitle: subtitle, quotesent: quotesent, location: location, description: description, images: images, bot: bot)
                    self.output.append(a)
                    
                }
            }
            
        }
        
    }
}

/// Store all Watchlist data
struct downloadwatchlistdatastruct: Identifiable  {
var id: String
var category: String
var title: String
var subtitle: String
var quotesent: Int
var location: String
var description: String
var images: String
var bot: Bool
}

/// Download all Watchlist data
class downloadalljobs: ObservableObject {
    @Published var output: [downloadalljobsdatastruct] = []
    @Published var count: NSNumber = 0
    
    let db = Firestore.firestore()
    let user = Auth.auth().currentUser
    
    func getData() {
        output.removeAll()
        print(self.user!.uid)
        db.collection("alljobs").getDocuments() { (querySnapshot, err) in
            if let err = err {
                print("Error getting documents: \(err)")
            } else {
                for document in querySnapshot!.documents {
                    print("\(document.documentID) => \(document.data())")
                    let data = document.data()
                    
                    let id = document.documentID
                    let category = data["category"] as? String ?? ""
                    let title = data["title"] as? String ?? ""
                    let subtitle = data["subtitle"] as? String ?? ""
                    let quotesent = data["quotesent"] as? Int ?? 0
                    let location = data["location"] as? String ?? ""
                    let description = data["description"] as? String ?? ""
                    let images = data["images"] as? String ?? ""
                    let bot = data["bot"] as? Bool ?? false
                    
                    let a = downloadalljobsdatastruct(id: id, category: category, title: title, subtitle: subtitle, quotesent: quotesent, location: location, description: description, images: images, bot: bot)
                    self.output.append(a)
                    
                }
            }
            
        }
        
    }
}

/// Store all Watchlist data
struct downloadalljobsdatastruct: Identifiable  {
var id: String
var category: String
var title: String
var subtitle: String
var quotesent: Int
var location: String
var description: String
var images: String
var bot: Bool
}



