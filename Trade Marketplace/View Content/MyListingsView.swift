//
//  MyListingsView.swift
//  Trade Marketplace
//
//  Created by William larsen on 24/09/22.
//

import SwiftUI

struct MyListingsView: View {
    var body: some View {
        VStack{
            CategoryNavigator(category: "My Listings")
            SearchViaCategory(category: "My Listings")
                .accentColor(.green)
            ScrollView{
                HStack{
                             VStack{
                                 Listing()
                                 Listing()
                                 Listing()
                                 Listing()
                             }
                             VStack{
                                 Listing()
                                 Listing()
                                 Listing()
                                 Listing()
                             }
            }
            }
        }.ignoresSafeArea()
    }
}

struct MyListingsView_Previews: PreviewProvider {
    static var previews: some View {
        MyListingsView()
    }
}


struct Listing: View {
    
    @State var tapped = false
    
    var tap: some Gesture {
            TapGesture(count: 1)
                .onEnded { _ in self.tapped = !self.tapped }
        }
    var body: some View {
            Image("money")
                    .resizable()
                    .scaledToFill()
                    .frame(width: 187, height: 187)
                    .cornerRadius(11)
                    .gesture(tap)
                    .overlay(self.tapped ? ListingTapped() : nil)
        
    }
}


struct ListingTapped: View {
    var body: some View {
        ContainerRelativeShape()
        .background(.ultraThinMaterial)
        .cornerRadius(11)
        .overlay(RoundedRectangle(cornerRadius: 11)
            .foregroundColor(.white)
            .frame(width: 156, height: 113, alignment: .center)
            .shadow(color: .gray, radius: 4, x: 0, y: 0)
            .opacity(0.9))
                .overlay(VStack{
                    Text("View Quotes")
                        .font(.custom("Poppins-SemiBold", size: 18))
                        .foregroundColor(Color("logogreen"))
                    Divider()
                        .background(.primary)
                        .frame(width: 136, height: 1, alignment: .center)
                    Text("View & Edit Listing")
                        .font(.custom("Poppins-SemiBold", size: 15))
                    .foregroundColor(.gray)

        })
    }
}

