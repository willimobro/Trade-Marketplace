//
//  LatestRecievedQuotesView.swift
//  Trade Marketplace
//
//  Created by William larsen on 24/09/22.
//

import SwiftUI

struct LatestRecievedQuotesView: View {
    var body: some View {
        
        VStack (spacing: 20) {
            CategoryNavigator(category: "Latest Recieved Quotes")
        ScrollView(.vertical){
            SearchViaCategory(category: "Recieved Quotes")
            HStack(spacing: 10){
                VStack{
                    Quote(isopened: false, timeago: "1 Hour ago")
                    Quote(isopened: false, timeago: "1 Hour ago")
                    Quote(isopened: true, timeago: "1 Hour ago")
                    Quote(isopened: true, timeago: "1 Hour ago")
                    Quote(isopened: true, timeago: "1 Hour ago")
                    Quote(isopened: true, timeago: "1 Hour ago")
                    Quote(isopened: true, timeago: "1 Hour ago")
                }
                VStack{
                    Quote(isopened: false, timeago: "1 Hour ago")
                    Quote(isopened: true, timeago: "1 Hour ago")
                    Quote(isopened: true, timeago: "1 Hour ago")
                    Quote(isopened: true, timeago: "1 Hour ago")
                    Quote(isopened: true, timeago: "1 Hour ago")
                    Quote(isopened: true, timeago: "1 Hour ago")
                    Quote(isopened: true, timeago: "1 Hour ago")
                }
                VStack{
                    Quote(isopened: false, timeago: "1 Hour ago")
                    Quote(isopened: true, timeago: "1 Hour ago")
                    Quote(isopened: true, timeago: "1 Hour ago")
                    Quote(isopened: true, timeago: "1 Hour ago")
                    Quote(isopened: true, timeago: "1 Hour ago")
                    Quote(isopened: true, timeago: "1 Hour ago")
                    Quote(isopened: true, timeago: "1 Hour ago")
                }
                }
        }
        .overlay(
            VStack{
                Spacer()
            }
        )
        }.ignoresSafeArea()
    }
}

struct LatestRecievedQuotesView_Previews: PreviewProvider {
    static var previews: some View {
        LatestRecievedQuotesView()
    }
}
