//
//  TabBar.swift
//  Trade Marketplace
//
//  Created by William larsen on 29/09/22.
//

import SwiftUI

struct TabBar: View {
    @State var selectedTab: Tab = .home
    
    var body: some View {
        ZStack(alignment: .bottom){
            Group{
            switch selectedTab {
            case .home:
                HomeView()
            case .search:
                CategoryView(categoryname: "Search")
            case .account:
                AccountView()
            case .message:
                MessengerView()
            case .profile:
                ProfileView()
                }
            }
            .frame(maxWidth: .infinity, maxHeight: .infinity)
            
            HStack{
                ForEach(tabItems) { item in
                    Button {
                        selectedTab = item.tab
                    }
                label:{
                        Image(systemName: item.icon)
                            .resizable()
                            .scaledToFit()
                            .frame(height: selectedTab == item.tab ? 30 : 26)
                        .frame(maxWidth: .infinity)
                    }
                .foregroundStyle(selectedTab == item.tab ? .primary : .secondary)
                }
            }
            .foregroundColor(.secondary)
            .frame(height: 64, alignment: .center)
            .padding(.horizontal, 15)
            .background(.white, in: Rectangle())
            .frame(maxHeight: .infinity, alignment: .bottom)
            .ignoresSafeArea()
        }
        
    }
}

struct TabBar_Previews: PreviewProvider {
    static var previews: some View {
        TabBar()
    }
}
