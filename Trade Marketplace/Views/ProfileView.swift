//
//  ProfileView.swift
//  Trade Marketplace
//
//  Created by William larsen on 24/09/22.
//

import SwiftUI

struct ProfileView: View {
    var body: some View {
        VStack {
            CategoryNavigator(category: "Profile")
            ProfileViewDescription()
            ReviewTab()
            Spacer()
        }.ignoresSafeArea()
    }
}

struct ProfileView_Previews: PreviewProvider {
    static var previews: some View {
        ProfileView()
    }
}

struct ProfileViewDescription: View {
    var body: some View {
        HStack{
            Circle()
                .foregroundColor(Color("Homebackgroundgreen"))
                .scaledToFit()
                .frame(width: 80, height: 80)
                .overlay(
                    Image("greenvan")
                        .resizable()
                        .scaledToFit())
            VStack (alignment: .leading, spacing: 0){
                Text("John Andrew")
                    .font(.custom("Poppins-SemiBold", size: 20))
                Text("Invercargill, Southland, NZ")
                    .foregroundColor(.gray)
                Text("@johnandrew27")
                    .foregroundColor(.gray)
            }.frame(height: 60)
        }.frame(width: 351, alignment: .leading)
    }
}

struct ReviewTab: View {
    @State  var profilemenu = String()
    
    var body: some View {
        VStack{
            HStack {
                HStack{
                    Image(systemName: "star.fill")
                    Image(systemName: "star.fill")
                    Image(systemName: "star.fill")
                    Image(systemName: "star.leadinghalf.filled")
                    Image(systemName: "star")
                }.foregroundColor(.green)
                    .frame(width: 150)
                Spacer()
                Text("17 Reviews")
                    .font(.custom("Poppins-SemiBold", size: 20))
            }.padding(.horizontal, 20)
            Divider()
                .background(.black)
            HStack{
                Picker("Quoted", selection: $profilemenu) {
                    Text("Quoted")
                }
                Picker("Reviews", selection: $profilemenu) {
                    Text("Reviews")
                    }
                Picker("Jobs", selection: $profilemenu) {
                    Text("Jobs")
                    }
            }.pickerStyle(.segmented)
                .padding(.horizontal, 20)
            ScrollView(.vertical){
                HStack(spacing: 60){
                    VStack{
                        Quote()
                        Quote()
                        Quote()
                        Quote()
                    }
                    VStack{
                        Quote()
                        Quote()
                        Quote()
                        Quote()
                    }
                }.padding(.horizontal, 26)
            }
        
        }
    }
}

