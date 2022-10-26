//
//  codeacademy -- delete after done.swift
//  Trade Marketplace
//
//  Created by William larsen on 22/10/22.
//

import SwiftUI

struct UserFetchingClient {
  static private let url = URL(string: "https://randomuser.me/api/?results=10&format=pretty")!
 
  static func getUsers() async throws -> String {
    async let (data, _) = URLSession.shared.data(from: url)
    return try await String(data: data, encoding: .utf8)!
  }
}

@MainActor
class UserData: ObservableObject {
   @Published var users: String = ""
 
  init() {
    Task {
      await loadUsers()
    }
  }
 
  func loadUsers() async {
    do {
      let users = try await UserFetchingClient.getUsers()
      self.users = users
    } catch {
      print(error)
    }
  }
}

struct UsersView: View {
  @StateObject var userData = UserData()
    var body: some View {
      NavigationView {
        VStack {
          Text("Raw JSON Data:")
          ScrollView {
            Text(userData.users)
          }
        }
        .padding()
        .navigationTitle("Random Users")
      }
    }
  }


struct UsersView_Previews: PreviewProvider {
    static var previews: some View {
        UsersView()
    }
}
